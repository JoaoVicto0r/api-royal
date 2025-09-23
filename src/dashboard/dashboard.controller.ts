import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.dashboardService.getDashboardData(
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }
}
