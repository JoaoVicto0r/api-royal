import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tickets } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(ticket: Tickets) {
    return {
      ...ticket,
      lastMessageAt: ticket.lastMessageAt?.toString(),
      startedAttendanceAt: ticket.startedAttendanceAt?.toString(),
      closedAt: ticket.closedAt?.toString(),
      lastMessageReceived: ticket.lastMessageReceived?.toString(),
      lastPauseAt: ticket.lastPauseAt?.toString(),
      totalPauseTime: ticket.totalPauseTime?.toString(),
    };
  }

  async findAll(tenantId: number) {
    const tickets = await this.prisma.tickets.findMany({
      where: { tenantId },
      include: {
        Contacts: true,
        Queues: true,
        Users: true,
        Whatsapps: true,
      },
    });
    return tickets.map(this.serializeBigInt);
  }

  async findById(id: number, tenantId: number) {
    const ticket = await this.prisma.tickets.findFirst({
      where: { id, tenantId },
      include: {
        Contacts: true,
        Queues: true,
        Users: true,
        Whatsapps: true,
      },
    });
    if (!ticket) return null;
    return this.serializeBigInt(ticket);
  }

  async updateStatus(id: number, status: string, tenantId: number) {
    const ticket = await this.prisma.tickets.updateMany({
      where: { id, tenantId },
      data: { status },
    });
    return ticket;
  }
}
