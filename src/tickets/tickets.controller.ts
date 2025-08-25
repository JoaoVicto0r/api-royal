// src/tickets/tickets.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Listar todos os tickets com mensagens
  @Get()
  async findAll() {
    return this.ticketsService.findAllTickets();
  }

  // Obter mensagens de um ticket
  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    const ticketId = Number(id);
    return this.ticketsService.getTicketMessages(ticketId);
  }

  // Criar novo ticket
  @Post()
  async create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(dto);
  }

  // Adicionar mensagem a um ticket existente
  @Post(':id/messages')
  async addMessage(@Param('id') id: string, @Body() dto: CreateMessageDto) {
    const ticketId = Number(id);
    return this.ticketsService.addMessage(ticketId, dto);
  }
}
