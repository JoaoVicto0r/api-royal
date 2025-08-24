import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  private logger = new Logger(TicketsService.name);

  constructor(private prisma: PrismaService) {}

  // Busca todos os tickets com contatos e usuários (tratando nulos)
  async findAll(tenantId: number) {
    try {
      const tickets = await this.prisma.tickets.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });

      const ticketsWithRelations = await Promise.all(
        tickets.map(async ticket => ({
          ...ticket,
          Contacts: ticket.contactId
            ? await this.prisma.contacts.findUnique({ where: { id: ticket.contactId } })
            : null,
          Users: ticket.userId
            ? await this.prisma.users.findUnique({ where: { id: ticket.userId } })
            : null,
        }))
      );

      return ticketsWithRelations;
    } catch (err) {
      this.logger.error('Erro ao buscar todos os tickets', err);
      throw err;
    }
  }

  // Busca ticket por ID
  async findById(id: number, tenantId: number) {
    try {
      const ticket = await this.prisma.tickets.findFirst({
        where: { id, tenantId },
      });

      if (!ticket) return null;

      return {
        ...ticket,
        Contacts: ticket.contactId
          ? await this.prisma.contacts.findUnique({ where: { id: ticket.contactId } })
          : null,
        Users: ticket.userId
          ? await this.prisma.users.findUnique({ where: { id: ticket.userId } })
          : null,
      };
    } catch (err) {
      this.logger.error(`Erro ao buscar ticket ${id}`, err);
      throw err;
    }
  }

  // Atualiza status de um ticket
  async updateStatus(id: number, status: string, tenantId: number) {
    try {
      return await this.prisma.tickets.updateMany({
        where: { id, tenantId },
        data: { status, updatedAt: new Date() },
      });
    } catch (err) {
      this.logger.error(`Erro ao atualizar status do ticket ${id}`, err);
      throw err;
    }
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
        return await this.prisma.tickets.update({
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

      return await this.prisma.tickets.create({
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
