import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  houseNo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  villageNo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  road?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subDistrictCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  districtCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  provinceCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullAddress?: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiProperty({ required: false, type: () => CreateUserAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserAddressDto)
  address?: CreateUserAddressDto;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
