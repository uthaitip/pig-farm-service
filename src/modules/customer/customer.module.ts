import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from 'src/services/customer.service';

@Module({
  imports: [CommonModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
