import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { FeedTypeController } from './controllers/feed-type.controller';
import { FeedTypeService } from 'src/services/feed-type.service';
import { FeedStockService } from 'src/services/feed-stock.service';

@Module({
  imports: [CommonModule],
  controllers: [FeedTypeController],
  providers: [FeedTypeService, FeedStockService],
  exports: [FeedTypeService, FeedStockService],
})
export class FeedTypeModule {}
