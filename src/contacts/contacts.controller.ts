import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return contacts.map(c => ({
      ...c,
      id: c.id.toString(),
      tenantId: c.tenantId?.toString(),
      telegramId: c.telegramId?.toString(),
      instagramPK: c.instagramPK?.toString(),
    }));
  }

   @Get('sync-google')
  async syncGoogle() {
    return this.contactsService.syncGoogleContacts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: any) {
    return await this.contactsService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.contactsService.update(Number(id), body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.contactsService.delete(Number(id));
  }
}
