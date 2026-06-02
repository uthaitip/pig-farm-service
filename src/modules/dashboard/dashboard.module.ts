import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [CommonModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
