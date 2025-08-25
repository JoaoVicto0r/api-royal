import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Contacts } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.contacts.findMany();
  }

  findOne(id: number) {
    return this.prisma.contacts.findUnique({ where: { id } });
  }

  create(data: Prisma.ContactsCreateInput) {
    return this.prisma.contacts.create({ data });
  }

  update(id: number, data: Prisma.ContactsUpdateInput) {
    return this.prisma.contacts.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.contacts.delete({ where: { id } });
  }
}
