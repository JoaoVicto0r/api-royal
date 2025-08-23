import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [PrismaModule, TicketsModule],
  providers: [ChatGateway, WhatsappService],
  exports: [ChatGateway],
})
export class ChatModule {}
