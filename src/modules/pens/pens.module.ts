import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { PensController } from './controllers/pens.controller';
import { PensService } from 'src/services/pens.service';

@Module({
  imports: [CommonModule],
  controllers: [PensController],
  providers: [PensService],
  exports: [PensService],
})
export class PensModule {}
