import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from 'src/services/users.service';
import { DataAddressService } from 'src/services/data-address.service';

@Module({
  imports: [CommonModule],
  controllers: [UsersController],
  providers: [UsersService, DataAddressService],
})
export class UsersModule {}
