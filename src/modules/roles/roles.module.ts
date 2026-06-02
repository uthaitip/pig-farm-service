import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from 'src/services/roles.service';

@Module({
  imports: [CommonModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
