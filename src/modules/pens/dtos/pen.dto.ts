import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePenDto {
  @ApiProperty({ example: 'คอก A1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdatePenDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
