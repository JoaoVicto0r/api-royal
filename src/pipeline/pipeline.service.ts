import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PipelineService {
  constructor(private readonly prisma: PrismaService) {}

  // Listar pipelines com stages + opportunities
  async findAll() {
    return await this.prisma.pipelines.findMany({
      include: {
        Stages: {
          orderBy: { order: 'asc' },
          include: { Opportunitys: true },
        },
        Opportunitys: true,
      },
    });
  }

  // Buscar um pipeline
  async findOne(id: number) {
    return await this.prisma.pipelines.findUnique({
      where: { id },
      include: {
        Stages: {
          orderBy: { order: 'asc' },
          include: { Opportunitys: true },
        },
        Opportunitys: true,
      },
    });
  }

  // Criar pipeline
  async create(data: { name: string; tenantId?: number }) {
    return await this.prisma.pipelines.create({
      data: {
        name: data.name,
        tenantId: data.tenantId || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Atualizar pipeline
  async update(id: number, data: Partial<{ name: string }>) {
    return await this.prisma.pipelines.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  // Deletar pipeline
  async delete(id: number) {
    return await this.prisma.pipelines.delete({ where: { id } });
  }

  // Listar stages de um pipeline
  async getStagesByPipeline(pipelineId: number) {
    return await this.prisma.stages.findMany({
      where: { pipelineId },
      orderBy: { order: 'asc' },
      include: { Opportunitys: true },
    });
  }

  async moveOpportunity(opportunityId: number, stageId: number) {
    return await this.prisma.opportunitys.update({
      where: { id: opportunityId },
      data: {
        stageId,
        updatedAt: new Date(),
      },
      include: {
        Stages: true, // ✅ Nome certo do relation no Prisma
        Contacts: true,
        Pipelines: true, // Se quiser retornar o pipeline junto
      },
    });
  }
}
