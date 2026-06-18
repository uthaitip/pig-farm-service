import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { FeedStockController } from './controllers/feed-stock.controller';
import { FeedStockService } from 'src/services/feed-stock.service';
import { FeedStockTransactionService } from 'src/services/feed-stock-transaction.service';

@Module({
  imports: [CommonModule],
  controllers: [FeedStockController],
  providers: [FeedStockService, FeedStockTransactionService],
  exports: [FeedStockService, FeedStockTransactionService],
})
export class FeedStockModule {}
