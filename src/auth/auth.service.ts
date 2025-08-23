import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) throw new UnauthorizedException('Senha inválida');

        return user;
    }
    
    async login(user: any) {
        const payload = { sub: user.id, role: user.profile };
        const token = this.jwtService.sign(payload);
        return token;
    }
}
