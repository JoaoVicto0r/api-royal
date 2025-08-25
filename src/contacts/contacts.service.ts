import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar todos os contatos
  async findAll() {
    try {
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
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw new Error('Não foi possível buscar os contatos');
    }
  }

  // Criar um contato simples (você pode expandir para incluir relações)
  async create(data: {
    name: string;
    number?: string;
    email?: string;
    tenantId?: number;
  }) {
    try {
      return await this.prisma.contacts.create({
        data: {
          name: data.name,
          number: data.number,
          email: data.email,
          tenantId: data.tenantId || 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw new Error('Não foi possível criar o contato');
    }
  }
}
