import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/auth/guards/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  async status() {
    return this.appService.status();
  }

  @Get('/protected')
  @UseGuards(JwtAuthGuard)
  async protected(@Req() req) {
    return {
      message: 'AuthGuard works 🎉',
      authenticated_user: req.user,
    };
  }
}
