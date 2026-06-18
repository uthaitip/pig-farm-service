import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { PigBatchController } from './controllers/pig-batch.controller';
import { PigBatchTransactionController } from './controllers/pig-batch-transaction.controller';
import { PigBatchService } from 'src/services/pig-batch.service';
import { PigBatchTransactionService } from 'src/services/pig-batch-transaction.service';

@Module({
  imports: [CommonModule],
  controllers: [PigBatchTransactionController, PigBatchController],
  providers: [PigBatchService, PigBatchTransactionService],
  exports: [PigBatchService, PigBatchTransactionService],
})
export class PigBatchModule {}
