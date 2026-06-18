import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { HousesController } from './controllers/houses.controller';
import { HousesService } from 'src/services/houses.service';

@Module({
  imports: [CommonModule],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
