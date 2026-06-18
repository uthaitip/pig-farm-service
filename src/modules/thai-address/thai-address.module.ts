import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { ThaiAddressController } from './controllers/thai-address.controller';

@Module({
  imports: [CommonModule],
  controllers: [ThaiAddressController],
  providers: [],
})
export class ThaiAddressModule {}
