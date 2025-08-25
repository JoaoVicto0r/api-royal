import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Listar todos os tickets com mensagens
  async findAllTickets() {
    return this.prisma.tickets.findMany({
      include: { Messages: true },
    });
  }

  // ✅ Buscar mensagens por ticket
  async getTicketMessages(ticketId: number) {
    return this.prisma.messages.findMany({
      where: { ticketId },
    });
  }

  // ✅ Criar ticket manualmente (via DTO)
  async createTicket(dto: CreateTicketDto) {
    const now = new Date();
    return this.prisma.tickets.create({
      data: {
        contactId: dto.contactId,
        status: dto.status || 'pending',
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // ✅ Adicionar mensagem a um ticket
  async addMessage(ticketId: number, dto: CreateMessageDto) {
    const now = new Date();
    return this.prisma.messages.create({
      data: {
        id: uuidv4(),
        ticketId,
        body: dto.body,
        createdAt: now,
        updatedAt: now,
        fromMe: dto.fromMe || false,
        userId: dto.userId || null,
      },
    });
  }

  // ✅ Criar ou atualizar ticket com base no número de telefone
  async createOrUpdate(contactNumber: string, text: string, status: string) {
    const now = new Date();

    // Busca contato pelo telefone
    let contact = await this.prisma.contacts.findFirst({
      where: { number: contactNumber },
    });

    // Se não existir contato, cria um novo
    if (!contact) {
      contact = await this.prisma.contacts.create({
        data: {
          number: contactNumber,
          name: 'Desconhecido', // ⚠️ ajuste conforme seu modelo
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    // Busca ticket associado ao contato
    let ticket = await this.prisma.tickets.findFirst({
      where: { contactId: contact.id },
    });

    if (!ticket) {
      ticket = await this.prisma.tickets.create({
        data: {
          contactId: contact.id,
          status,
          createdAt: now,
          updatedAt: now,
        },
      });
    } else {
      ticket = await this.prisma.tickets.update({
        where: { id: ticket.id },
        data: {
          status,
          updatedAt: now,
        },
      });
    }

    // Cria mensagem associada ao ticket
    await this.prisma.messages.create({
      data: {
        id: uuidv4(),
        ticketId: ticket.id,
        body: text,
        createdAt: now,
        updatedAt: now,
        fromMe: false,
        userId: null,
      },
    });

    return ticket;
  }
}
