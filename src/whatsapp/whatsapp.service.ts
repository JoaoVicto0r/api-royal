import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class WhatsappService {
  private logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    private ticketsService: TicketsService,
    private chatGateway: ChatGateway,
  ) {
    this.startSock();
  }

  async startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp_auth');

    const sock = makeWASocket({
      printQRInTerminal: true,
      auth: state,
    });

    sock.ev.on('messages.upsert', async (msg) => {
      try {
        const message = msg.messages[0];
        if (!message?.key) return;

        const from = message.key.remoteJid ?? '';
        const text = (message.message?.conversation ?? '') as string;
        const messageId = message.key.id ?? '';
        const now = new Date();

        // Salva no DB
        const savedMessage = await this.prisma.apiMessages.create({
          data: {
            sessionId: 1, // ajuste com o ID correto do WhatsApp
            tenantId: 1,
            number: from,
            body: text,
            messageId: messageId,
            messageWA: JSON.parse(JSON.stringify(message)), // serializa
            createdAt: now,
            updatedAt: now,
          },
        });

        // Converte remoteJid para número único para o ticket
        const contactId = parseInt(from.replace(/\D/g, ''), 10).toString();
const ticket = await this.ticketsService.createOrUpdate(contactId, Number(text), "1");
        // Emite para todos os clientes conectados via Socket.io
        this.chatGateway.sendMessage({
          from,
          body: text,
          ticketId: ticket.id,
        });
      } catch (err) {
        this.logger.error(err);
      }
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          this.logger.warn('Reconectando WhatsApp...');
          this.startSock();
        }
      } else if (connection === 'open') {
        this.logger.log('WhatsApp conectado com sucesso!');
      }
    });

    sock.ev.on('creds.update', saveCreds);
  }
}
