import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    return this.contactsService.findAll();
  }

  @Post()
  async create(
    @Body() body: { name: string; number?: string; email?: string; tenantId?: number },
  ) {
    return this.contactsService.create(body);
  }
}
