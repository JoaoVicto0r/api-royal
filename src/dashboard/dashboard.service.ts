import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    // Contagem total de tickets
    const totalTickets = await this.prisma.tickets.count();

    // Contagem de contatos ativos (tickets com status != closed)
    const contatosAtivos = await this.prisma.tickets.count({
      where: { status: { not: 'closed' } },
    });

    // Tempo médio: exemplo fictício (média em minutos entre startedAttendanceAt e closedAt)
    const tickets = await this.prisma.tickets.findMany({
      select: { startedAttendanceAt: true, closedAt: true },
      where: { startedAttendanceAt: { not: null }, closedAt: { not: null } },
    });

    const tempoMedio =
      tickets.length > 0
        ? Math.round(
            tickets
              .map(t => (t.closedAt - t.startedAttendanceAt) / 60000) // ms -> minutos
              .reduce((a, b) => a + b, 0) / tickets.length,
          ) + 'm'
        : '0m';

    // Taxa de resolução: % tickets fechados
    const closedTickets = await this.prisma.tickets.count({
      where: { status: 'closed' },
    });
    const taxaResolucao =
      totalTickets > 0 ? (closedTickets / totalTickets) * 100 : 0;

    // Dados para gráficos (exemplos simples)
    const weeklyData = await this.prisma.tickets.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusData = [
      { name: 'Pending', value: await this.prisma.tickets.count({ where: { status: 'pending' } }), color: '#facc15' },
      { name: 'In Progress', value: await this.prisma.tickets.count({ where: { status: 'in_progress' } }), color: '#4f46e5' },
      { name: 'Closed', value: await this.prisma.tickets.count({ where: { status: 'closed' } }), color: '#10b981' },
    ];

    return {
      totalTickets,
      contatosAtivos,
      tempoMedio,
      taxaResolucao,
      weeklyData: weeklyData.map(w => ({ day: w.status, tickets: w._count.status, messages: 0 })), // você pode adaptar
      hourlyData: [], // implementar se quiser
      statusData,
      userAttendanceData: [], // implementar
      channelData: [], // implementar
      connectionData: [], // implementar
      demandData: [], // implementar
    };
  }
}
