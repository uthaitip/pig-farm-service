import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeedTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  feedName!: string;

  @ApiProperty({ enum: ['FEED', 'MEDICINE', 'VACCINE'] })
  @IsNotEmpty()
  @IsEnum(['FEED', 'MEDICINE', 'VACCINE'])
  category!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateFeedTypeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedName?: string;

  @ApiProperty({ required: false, enum: ['FEED', 'MEDICINE', 'VACCINE'] })
  @IsOptional()
  @IsEnum(['FEED', 'MEDICINE', 'VACCINE'])
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumQuantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
