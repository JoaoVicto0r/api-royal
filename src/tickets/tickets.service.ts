import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tickets.findMany({
      include: { messages: true },
    });
  }

  createTicket(dto: CreateTicketDto) {
    return this.prisma.tickets.create({
      data: {
        ...dto,
        contactId: Number(dto.contactId), // ✅ converter para number
      },
    });
  }

  addMessage(ticketId: string, dto: CreateMessageDto) {
    return this.prisma.messages.create({
      data: {
        ...dto,
        ticketId: Number(ticketId), // ✅ converter para number
      },
    });
  }

    getMessages(ticketId: string) {
    return this.prisma.messages.findMany({
      where: { ticketId: Number(ticketId) },
      orderBy: { createdAt: 'asc' },
    });
  }

}
