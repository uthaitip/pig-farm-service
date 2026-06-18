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

export class CreatePenDto {
  @ApiProperty({ example: 'คอก A1' })
  @IsNotEmpty()
  @IsString()
  penName!: string;

  @ApiProperty({ example: '665f1b2e3c4d5e6f7a8b9c0d' })
  @IsNotEmpty()
  @IsMongoId()
  houseId!: string;

  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacity!: number;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'FULL', 'MAINTENANCE'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['ACTIVE', 'FULL', 'MAINTENANCE'])
  status!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePenDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  penCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  penName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  houseId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacity?: number;

  @ApiProperty({ required: false, enum: ['ACTIVE', 'FULL', 'MAINTENANCE'] })
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'FULL', 'MAINTENANCE'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
