import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { TicketsModule } from './tickets/tickets.module';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, WhatsappModule, TicketsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatService], 
})
export class AppModule {}
