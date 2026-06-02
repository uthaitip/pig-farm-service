import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { CrudController } from './controllers/crud.controller';
import { DataAddressService } from 'src/services/data-address.service';

@Module({
  imports: [CommonModule],
  controllers: [CrudController],
  providers: [DataAddressService],
})
export class DataAddressModule {}
