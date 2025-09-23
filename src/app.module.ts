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
import { DashboardModule } from './dashboard/dashboard.module';
import { ContactsModule } from './contacts/contacts.module';
import { GoogleService } from './google/google.service';
import { GoogleController } from './google/google.controller';
import { GoogleModule } from './google/google.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { QueuesModule } from './queues/queues.module';
@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    WhatsappModule,
    TicketsModule,
    ChatModule,
    DashboardModule,
    ContactsModule,
    GoogleModule,
    PipelineModule,
  ],
  controllers: [AppController, GoogleController],
  providers: [AppService, ChatService, GoogleService],
})
export class AppModule {}
