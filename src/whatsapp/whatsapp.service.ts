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
      printQRInTerminal: false, 
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

        const safeMessage = JSON.parse(
          JSON.stringify(message, (_, value) => (typeof value === 'bigint' ? value.toString() : value)),
        );

        await this.prisma.apiMessages.create({
          data: {
            sessionId: 1,
            tenantId: 1,
            number: from,
            body: text,
            messageId: messageId,
            messageWA: safeMessage,
            createdAt: now,
            updatedAt: now,
          },
        });

        // Extrai só números do remoteJid para usar como telefone
        const contactNumber = from.replace(/\D/g, '');

        // Cria ou atualiza ticket usando número e texto
        const ticket = await this.ticketsService.createOrUpdate(contactNumber, text, "1");

        // Envia mensagem via WebSocket
        this.chatGateway.sendMessage({
          from,
          body: text,
          ticketId: ticket.id.toString(),
        });

      } catch (err) {
        this.logger.error(err);
      }
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('QR gerado:', qr);
        this.chatGateway.sendQrCode(qr);
      }

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
