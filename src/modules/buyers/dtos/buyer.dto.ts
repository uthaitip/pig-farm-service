import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserAddressDto } from 'src/modules/users/dtos/user.dto';

export class CreateBuyerDto {
  @ApiProperty({ example: 'นายสมชาย ใจดี' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, type: () => CreateUserAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address?: CreateUserAddressDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateBuyerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, type: () => CreateUserAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address?: CreateUserAddressDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
