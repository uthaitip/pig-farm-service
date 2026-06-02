import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteManyDto {
  @ApiProperty()
  @IsArray()
  identities: string[];
}
