import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { TicketsModule } from '../tickets/tickets.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TicketsModule, PrismaModule, ChatModule],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
