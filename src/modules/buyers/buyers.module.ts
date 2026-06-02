import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { BuyersController } from './controllers/buyers.controller';
import { BuyersService } from 'src/services/buyers.service';
import { DataAddressService } from 'src/services/data-address.service';

@Module({
  imports: [CommonModule],
  controllers: [BuyersController],
  providers: [BuyersService, DataAddressService],
})
export class BuyersModule {}
