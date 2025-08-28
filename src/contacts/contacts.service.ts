import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleService } from 'src/google/google.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleService: GoogleService,
    private readonly whatsappService: WhatsappService,
  ) {}

  // Buscar todos os contatos
  async findAll() {
    return await this.prisma.contacts.findMany({
      include: {
        AutoReplyLogs: true,
        BirthdayMessagesSents: true,
        CampaignContacts: true,
        ContactCustomFields: true,
        ContactTags: true,
        ContactWallets: true,
        Messages: true,
        MessagesOffLine: true,
        Opportunitys: true,
        Tickets: true,
        Tenants: true,
      },
    });
  }

  // Buscar contato pelo ID
  async findOne(id: number) {
    return await this.prisma.contacts.findUnique({
      where: { id },
      include: {
        AutoReplyLogs: true,
        BirthdayMessagesSents: true,
        CampaignContacts: true,
        ContactCustomFields: true,
        ContactTags: true,
        ContactWallets: true,
        Messages: true,
        MessagesOffLine: true,
        Opportunitys: true,
        Tickets: true,
        Tenants: true,
      },
    });
  }

  // Criar novo contato
  async create(data: {
  name: string; 
  number?: string;
  email?: string;
  tenantId?: number;
  isGroup?: boolean;
  isWAContact?: boolean;
  pushname?: string;
  telegramId?: bigint;
  instagramPK?: bigint;
  messengerId?: string;
  birthdayDate?: string;
  cpf?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
}) {
  return await this.prisma.contacts.create({
    data: {
      name: data.name,  
      number: data.number,
      email: data.email,
      tenantId: data.tenantId || 1,
      isGroup: data.isGroup || false,
      isWAContact: data.isWAContact,
      pushname: data.pushname,
      telegramId: data.telegramId,
      instagramPK: data.instagramPK,
      messengerId: data.messengerId,
      birthdayDate: data.birthdayDate,
      cpf: data.cpf,
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

  // Atualizar contato
  async update(id: number, data: Partial<any>) {
    return await this.prisma.contacts.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  // Sincronizar contatos do Google
  async syncGoogleContacts() {
    const contacts = await this.googleService.getContacts();

    for (const c of contacts) {
      await this.prisma.contacts.upsert({
        where: { number_tenantId: { number: c.number || '', tenantId: 1 } },
        update: { name: c.name, email: c.email, updatedAt: new Date() },
        create: {
          name: c.name,
          email: c.email,
          number: c.number,
          tenantId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  // Sincronizar e enviar contatos para o WhatsApp
  async syncAndSendWhatsapp() {
    await this.syncGoogleContacts();

    const contacts = await this.prisma.contacts.findMany({ where: { isWAContact: true } });

    const waContacts = contacts
      .filter(c => c.number) 
      .map(c => ({
        name: c.name,
        number: c.number!, 
      }));

    await this.whatsappService.sendContacts(waContacts);
  }

  // Deletar contato
  async delete(id: number) {
    return await this.prisma.contacts.delete({
      where: { id },
    });
  }
}
