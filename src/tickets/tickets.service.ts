import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  private logger = new Logger(TicketsService.name);

  constructor(private prisma: PrismaService) {}

  // Busca todos os tickets
  async findAll(tenantId: number) {
    return this.prisma.tickets.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Busca ticket por ID
  async findById(id: number, tenantId: number) {
    return this.prisma.tickets.findFirst({
      where: { id, tenantId },
    });
  }

  // Atualiza status de um ticket
  async updateStatus(id: number, status: string, tenantId: number) {
    return this.prisma.tickets.updateMany({
      where: { id, tenantId },
      data: { status, updatedAt: new Date() },
    });
  }

  // Cria ou atualiza ticket baseado no número do contato
  async createOrUpdate(
    contactNumber: string, 
    tenantId: number,
    lastMessage: string,
    whatsappId?: number,
  ) {
    try {
      const contact = await this.prisma.contacts.findFirst({
        where: { number: contactNumber, tenantId },
      });

      if (!contact) {
        throw new Error(`Contato ${contactNumber} não encontrado`);
      }

      const contactId = contact.id;

      const existingTicket = await this.prisma.tickets.findFirst({
        where: { contactId, tenantId },
        orderBy: { createdAt: 'desc' },
      });

      if (existingTicket) {
        return this.prisma.tickets.update({
          where: { id: existingTicket.id },
          data: {
            lastMessage,
            updatedAt: new Date(),
            whatsappId,
            unreadMessages: (existingTicket.unreadMessages || 0) + 1,
            answered: false,
          },
        });
      }

      return this.prisma.tickets.create({
        data: {
          lastMessage,
          contactId,
          tenantId,
          status: 'pending',
          whatsappId,
          createdAt: new Date(),
          updatedAt: new Date(),
          unreadMessages: 1,
          answered: false,
        },
      });
    } catch (err) {
      this.logger.error('Erro ao criar ou atualizar ticket', err);
      throw err;
    }
  }
}
