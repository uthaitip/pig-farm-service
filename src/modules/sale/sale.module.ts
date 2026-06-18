import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { SaleController } from './controllers/sale.controller';
import { SaleService } from 'src/services/sale.service';
import { SaleDetailService } from 'src/services/sale-detail.service';
import { PigBatchService } from 'src/services/pig-batch.service';
import { PigBatchTransactionService } from 'src/services/pig-batch-transaction.service';

@Module({
  imports: [CommonModule],
  controllers: [SaleController],
  providers: [SaleService, SaleDetailService, PigBatchService, PigBatchTransactionService],
  exports: [SaleService, SaleDetailService],
})
export class SaleModule {}
