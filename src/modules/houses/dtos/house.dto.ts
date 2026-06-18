import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHouseDto {
  @ApiProperty({ example: 'โรงเรือนขุน 1' })
  @IsNotEmpty()
  @IsString()
  houseName!: string;

  @ApiProperty({ example: '665f1b2e3c4d5e6f7a8b9c0d' })
  @IsNotEmpty()
  @IsMongoId()
  houseTypeId!: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateHouseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  houseCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  houseName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  houseTypeId?: string;

  @ApiProperty({ required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
