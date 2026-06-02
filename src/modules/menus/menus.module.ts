import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { MenusController } from './controllers/menus.controller';
import { MenusService } from 'src/services/menus.service';

@Module({
  imports: [CommonModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
