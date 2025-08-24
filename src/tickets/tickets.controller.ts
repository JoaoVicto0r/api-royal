import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Listar todos tickets
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  // Criar ticket
  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  // Adicionar mensagem a um ticket
  @Post(':ticketId/messages')
  addMessage(
    @Param('ticketId') ticketId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.ticketsService.addMessage(ticketId, createMessageDto);
  }

  // Buscar mensagens de um ticket
  @Get(':ticketId/messages')
  getMessages(@Param('ticketId') ticketId: string) {
    return this.ticketsService.getMessages(ticketId);
  }
}
