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

export class CreatePigBatchDto {
  @ApiProperty({ example: 'หมูรุ่น มิ.ย.69' })
  @IsOptional()
  @IsString()
  batchName?: string;

  @ApiProperty({ example: '665f1b2e3c4d5e6f7a8b9c0d' })
  @IsNotEmpty()
  @IsMongoId()
  penId!: string;

  @ApiProperty({ enum: ['BORN', 'PURCHASED'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['BORN', 'PURCHASED'])
  sourceType!: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsNotEmpty()
  @IsString()
  receivedDate!: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  initialQuantity!: number;

  @ApiProperty({ example: 35, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageWeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePigBatchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  batchName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  penId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receivedDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageWeight?: number;

  @ApiProperty({ required: false, enum: ['ACTIVE', 'CLOSED'] })
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'CLOSED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
