import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketsModule } from '../tickets/tickets.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => TicketsModule), // evita circularidade
    forwardRef(() => WhatsappModule), // se ChatGateway precisar de WhatsappService
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
