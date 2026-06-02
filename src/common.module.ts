import { Module } from '@nestjs/common';
import { DBModels } from './db.model';

@Module({
  imports: [...DBModels],
  controllers: [],
  providers: [],
  exports: [...DBModels],
})
export class CommonModule {}
