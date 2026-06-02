import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { FeedController } from './controllers/feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [CommonModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
