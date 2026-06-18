import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  expenseCategoryId!: string;

  @ApiProperty({ example: '2026-06-07' })
  @IsNotEmpty()
  @IsString()
  expenseDate!: string;

  @ApiProperty({ example: 15000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attachment?: string;
}
