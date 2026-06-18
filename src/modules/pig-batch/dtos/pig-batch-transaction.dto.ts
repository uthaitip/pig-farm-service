import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePigBatchTransactionDto {
  @ApiProperty({ example: '665f1b2e3c4d5e6f7a8b9c0d' })
  @IsNotEmpty()
  @IsMongoId()
  batchId!: string;

  @ApiProperty({ enum: ['RECEIVE', 'MOVE_IN', 'MOVE_OUT', 'DEAD', 'SOLD', 'ADJUST'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['RECEIVE', 'MOVE_IN', 'MOVE_OUT', 'DEAD', 'SOLD', 'ADJUST'])
  transactionType!: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: '2026-06-01' })
  @IsNotEmpty()
  @IsString()
  transactionDate!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fromPenId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  toPenId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeId?: string;
}
