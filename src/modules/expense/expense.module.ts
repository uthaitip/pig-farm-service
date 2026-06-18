import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseService } from 'src/services/expense.service';

@Module({
  imports: [CommonModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
