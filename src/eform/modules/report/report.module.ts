import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { FeedStockReportController } from './controllers/feed-stock.controller';

@Module({
  imports: [CommonModule],
  controllers: [FeedStockReportController],
})
export class ReportModule {}
