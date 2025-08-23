import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../prisma/prisma.service';
import { TicketsService } from '../tickets/tickets.service';
import { ChatGateway } from '../chat/chat.gateway'; // caminho correto

@Module({
  providers: [WhatsappService, PrismaService, TicketsService, ChatGateway],
  exports: [WhatsappService],
})
export class WhatsappModule {}
