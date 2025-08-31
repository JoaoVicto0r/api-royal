import { Module, forwardRef } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { TicketsModule } from '../tickets/tickets.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TicketsModule,
    forwardRef(() => ChatModule), // evita problema de dependência circular
  ],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
