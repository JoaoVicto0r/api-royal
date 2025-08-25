import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    const contacts = await this.contactsService.findAll();

    // Converte BigInt para string
    const serializedContacts = contacts.map(contact => ({
      ...contact,
      id: contact.id.toString(),
      tenantId: contact.tenantId?.toString(), // se existir BigInt
    }));

    return serializedContacts;
  }

  @Post()
  async create(@Body() body: { name: string; number?: string; email?: string; tenantId?: number }) {
    return this.contactsService.create(body);
  }
}
