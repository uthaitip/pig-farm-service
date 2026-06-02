import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0812345678', description: 'เบอร์โทรที่ลงทะเบียนไว้' })
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'sessionId ที่ได้จาก request-otp' })
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  @ApiProperty({ example: '123456' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @ApiProperty({ example: 'A1B2' })
  ref: string;
}
