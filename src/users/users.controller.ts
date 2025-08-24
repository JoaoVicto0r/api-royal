import { Controller, Get, Query, Param, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('by-email')
    async getUserByEmail(@Query('email') email: string) {
        const user = await this.usersService.findByEmail(email);
        if(!user) return { message: 'Usuario não encontrado'};
        return user; 
    }
    @Get('me')
    async getMe(@Req() req: Request) {
        // aqui você pode pegar o usuário logado via token, por enquanto teste com ID fixo
        const userId = 1; // substitua pela lógica real
        return this.usersService.findOne(userId);
    }

    @Get(':id')
    async getUserId(@Param('id') id: string) {
        const user = await this.usersService.findById(Number(id));
        if(!user) return { message: 'Usuario não encontrado'};
        return user;
    }

    @Get()
    async getAllUsers(): Promise<Users[]> {
        return this.usersService.findAll();
    }

    @Post()
    async createUser(@Body() body: any){
        return this.usersService.createUser(body);
    }

}
