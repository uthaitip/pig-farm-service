import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: '2026-06-07' })
  @IsNotEmpty()
  @IsString()
  transactionDate!: string;

  @ApiProperty({ required: false, example: 350 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiProperty({ required: false, example: 17500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  batchId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateAdjustDto {
  @ApiProperty({ description: 'Positive = increase, negative = decrease', example: -5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: '2026-06-07' })
  @IsNotEmpty()
  @IsString()
  transactionDate!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
