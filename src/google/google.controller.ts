import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  // Retorna a URL para login do Google
  @Get('auth-url')
  getAuthUrl() {
    return { url: this.googleService.getAuthUrl() };
  }

  // Recebe o code do Google OAuth e retorna tokens
  @Get('callback')
  async callback(@Query('code') code: string) {
    const tokens = await this.googleService.getTokens(code);
    return tokens;
  }
}
