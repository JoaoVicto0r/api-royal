import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';
import { ChatGateway } from '../chat/chat.gateway';


enum DisconnectReason {
  connectionClosed = 428,
  connectionLost = 408,
  connectionReplaced = 440,
  timedOut = 408,
  loggedOut = 401,
  badSession = 500,
  restartRequired = 515,
  multideviceMismatch = 411,
  forbidden = 403,
  unavailableService = 503
}

@Injectable()
export class WhatsappService {
  private logger = new Logger(WhatsappService.name);
  private sock;

  constructor(
    private prisma: PrismaService,
    private ticketsService: TicketsService,
    private chatGateway: ChatGateway,
  ) {
    this.startSock();
  }

  async startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('whatsapp_auth');

    this.sock = makeWASocket({
      printQRInTerminal: false,
      auth: state,
    });

    this.sock.ev.on('messages.upsert', async (msg) => {
      // seu código para mensagem recebida
    });

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.logger.log('QR code gerado');
        this.chatGateway.sendQrCode(qr);
      }

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error &&
          (lastDisconnect.error as Boom).output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          this.logger.warn('Reconectando WhatsApp...');
          this.startSock();
        } else {
          this.logger.warn('Logout detectado. Reconexão não será tentada.');
        }
      } else if (connection === 'open') {
        this.logger.log('WhatsApp conectado com sucesso!');
      }
    });

    this.sock.ev.on('creds.update', saveCreds);
  }

  async sendContacts(contacts: { name: string; number: string }[]) {
  if (!this.sock) return;
  
  for (const contact of contacts) {
    if (!contact.number) continue;

    try {
      // Converte número para o formato do WhatsApp
      const jid = `${contact.number.replace(/\D/g, '')}@s.whatsapp.net`;

      await this.sock.sendMessage(jid, {
        text: `Olá ${contact.name}, você foi adicionado aos nossos contatos!`,
      });

      this.logger.log(`Mensagem enviada para ${contact.name} (${contact.number})`);
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para ${contact.name}: ${error}`);
    }
  }
}

}
