import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: { email },
        });
    }

    async findById(id: number): Promise<Users | null> {
        return this.prisma.users.findUnique({
            where: { id },
        });
    }


    async findAll(): Promise<Users[]> {
        return this.prisma.users.findMany();
    }

   async createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
        profile?: string;
        tenantId?: number;
        }) {
            return this.prisma.users.create({
                data: {
                    ...data,
                } as any, 
    });
 }

}
