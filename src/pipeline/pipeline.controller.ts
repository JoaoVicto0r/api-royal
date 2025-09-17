import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get()
  async getPipelines() {
    return this.pipelineService.findAll();
  }

  // GET /pipeline/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      throw new BadRequestException(`ID inválido recebido: ${id}`);
    }
    return await this.pipelineService.findOne(numId);
  }

  // POST /pipeline
  @Post()
  async create(@Body() body: any) {
    return await this.pipelineService.create(body);
  }

  // PATCH /pipeline/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.pipelineService.update(Number(id), body);
  }

  // DELETE /pipeline/:id
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.pipelineService.delete(Number(id));
  }

  // GET /pipeline/:id/stages → pega estágios do pipeline
  @Get(':id/stages')
  async getStages(@Param('id') id: string) {
    return await this.pipelineService.getStagesByPipeline(Number(id));
  }

  @Put(':opportunityId/move')
  async moveOpportunity(
    @Param('opportunityId') opportunityId: string,
    @Body('stageId') stageId: number,
  ) {
    const numOppId = Number(opportunityId);
    if (isNaN(numOppId) || numOppId <= 0) {
      throw new BadRequestException(`ID inválido: ${opportunityId}`);
    }
    return await this.pipelineService.moveOpportunity(numOppId, stageId);
  }
}
