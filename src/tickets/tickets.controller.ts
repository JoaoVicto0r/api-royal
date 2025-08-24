import { Controller, Get, Param, Patch, Body, Query, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  async findAll(@Query('tenantId', ParseIntPipe) tenantId: number) {
    return this.ticketsService.findAll(tenantId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ) {
    return this.ticketsService.findById(id, tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ) {
    return this.ticketsService.updateStatus(id, status, tenantId);
  }
}
