import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(dto);
    return MyResponse.sendOk(res, result);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    return MyResponse.sendOk(res, result);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }, @Res() res: Response) {
    const result = await this.authService.refresh(body.refreshToken);
    return MyResponse.sendOk(res, result);
  }

  @Get('me')
  async getMe(@Res() res: Response) {
    const userId = res.locals.user?.id;
    const result = await this.authService.getProfile(userId);
    return MyResponse.sendOk(res, result);
  }

  @Get('profile')
  async getProfile(@Res() res: Response) {
    const userId = res.locals.user?.id;
    const result = await this.authService.getProfile(userId);
    return MyResponse.sendOk(res, result);
  }
}
