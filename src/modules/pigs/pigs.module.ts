import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { PigsController } from './controllers/pigs.controller';
import { PigsService } from './pigs.service';

@Module({
  imports: [CommonModule],
  controllers: [PigsController],
  providers: [PigsService],
})
export class PigsModule {}
