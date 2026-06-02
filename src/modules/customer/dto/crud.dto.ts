import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerCode!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  citizenId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  genderCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstNameEn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastNameEn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  issuePlace?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expirationDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lineId?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
