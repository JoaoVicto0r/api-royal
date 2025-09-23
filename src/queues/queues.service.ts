import { Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QueuesService {
  constructor (private readonly prisma: PrismaService) {}

  //criação do Kanban 
  async createQueue(dto: CreateQueueDto) {
    const now = new Date();
    return this.prisma.queues.create({
      data: {
          
          createdAt: now,
      },
    });
  }

  findAll() {
    return `This action returns all queues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} queue`;
  }

  update(id: number, updateQueueDto: UpdateQueueDto) {
    return `This action updates a #${id} queue`;
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
