import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'สมชาย ใจดี' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'admin@farm.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '081-234-5678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
