import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleModule } from 'src/google/google.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { TicketsModule } from 'src/tickets/tickets.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({

	import:[PrismaModule, GoogleModule, TicketModule, ChatModule],
	controllers: [ContactsController],
	providers: [ContactsService, PrismaService, WhatsappService],
})

export class ContactsModule{}

