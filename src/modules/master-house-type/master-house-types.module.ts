import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { MasterHouseTypeController } from './controllers/master-house-types.controller';
import { MasterHouseTypeService } from 'src/services/master-house-types.service';

@Module({
  imports: [CommonModule],
  controllers: [MasterHouseTypeController],
  providers: [MasterHouseTypeService],
  exports: [MasterHouseTypeService],
})
export class MasterHouseTypeModule {}
