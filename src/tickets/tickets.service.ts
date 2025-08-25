// src/tickets/tickets.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  // Listar todos os tickets com mensagens
  async findAllTickets() {
    return this.prisma.tickets.findMany({
      include: { Messages: true },
    });
  }

  // Buscar ticket por contactId
  async findTicketByContactId(contactId: number) {
    return this.prisma.tickets.findFirst({
      where: { contactId },
      include: { Messages: true },
    });
  }

  // Criar um novo ticket
  async createTicket(dto: CreateTicketDto) {
    const now = new Date();

    return this.prisma.tickets.create({
      data: {
        contactId: dto.contactId,
        status: dto.status,
        createdAt: now,
        updatedAt: now,
      },
      include: { Messages: true },
    });
  }

  // Obter mensagens de um ticket
  async getTicketMessages(ticketId: number) {
    return this.prisma.messages.findMany({
      where: { ticketId },
    });
  }

  // Adicionar mensagem a um ticket existente
  async addMessage(ticketId: number, dto: CreateMessageDto) {
    const now = new Date();

    return this.prisma.messages.create({
      data: {
        id: uuidv4(),          // ID obrigatório
        ticketId,
        body: dto.body,
        createdAt: now,
        updatedAt: now,
        fromMe: dto.fromMe || false,
        userId: dto.userId || null,
      },
    });
  }

  // Criar ou atualizar ticket e adicionar mensagem
  async createOrUpdate(contactId: number, text: string, status: string) {
    const now = new Date();

    // Verifica se já existe um ticket para o contactId
    let ticket = await this.prisma.tickets.findFirst({
      where: { contactId },
    });

    if (!ticket) {
      // Cria novo ticket
      ticket = await this.prisma.tickets.create({
        data: {
          contactId,
          status,
          createdAt: now,
          updatedAt: now,
        },
      });
    } else {
      // Atualiza ticket existente
      ticket = await this.prisma.tickets.update({
        where: { id: ticket.id },
        data: { status, updatedAt: now },
      });
    }

    // Adiciona mensagem ao ticket
    await this.prisma.messages.create({
      data: {
        id: uuidv4(),
        ticketId: ticket.id,
        body: text,
        createdAt: now,
        updatedAt: now,
        fromMe: true,
        userId: null,
      },
    });

    return ticket;
  }
}
