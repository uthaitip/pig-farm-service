import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
