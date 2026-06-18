import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { ExpenseCategoryController } from './controllers/expense-category.controller';
import { ExpenseCategoryService } from 'src/services/expense-category.service';

@Module({
  imports: [CommonModule],
  controllers: [ExpenseCategoryController],
  providers: [ExpenseCategoryService],
  exports: [ExpenseCategoryService],
})
export class ExpenseCategoryModule {}
