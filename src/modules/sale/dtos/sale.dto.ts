import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  batchId!: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageWeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalWeight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerKg?: number;

  @ApiProperty({ example: 120000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;
}

export class CreateSaleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  customerId!: string;

  @ApiProperty({ example: '2026-06-05' })
  @IsNotEmpty()
  @IsString()
  saleDate!: string;

  @ApiProperty({ required: false, enum: ['DRAFT', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsIn(['DRAFT', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [CreateSaleDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  details!: CreateSaleDetailDto[];
}
