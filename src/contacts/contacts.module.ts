// src/contacts/contacts.module.ts
import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ContactsController],
  providers: [ContactsService, PrismaService],
  exports: [ContactsService], // exporta se outro módulo precisar do serviço
})
export class ContactsModule {}
