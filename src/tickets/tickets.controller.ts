import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  findAll(@Query('tenantId') tenantId: number) {
    return this.ticketsService.findAll(tenantId);
  }

  @Get(':id')
  findById(@Param('id') id: number, @Query('tenantId') tenantId: number) {
    return this.ticketsService.findById(id, tenantId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @Query('tenantId') tenantId: number,
  ) {
    return this.ticketsService.updateStatus(id, status, tenantId);
  }
}
