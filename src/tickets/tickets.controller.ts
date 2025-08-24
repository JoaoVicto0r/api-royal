import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.ticketsService.findAll(Number(tenantId));
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.ticketsService.findById(Number(id), Number(tenantId));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.ticketsService.updateStatus(
      Number(id),
      status,
      Number(tenantId),
    );
  }
}
