import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';

export class DataAddressManageDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customerCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  houseCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  houseNo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  villageNo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  villageName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alley?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lane?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  road?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subDistrictCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  districtCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provinceCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressTypeId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  isDefault?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  isIdCard?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullAddress?: string;

  code?: string;
}

export class DataAddressUpdateIsActiveDto {
  @ApiProperty()
  @IsInt()
  isActive!: number;
}

export class DataAddressUpdateDto extends DataAddressManageDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  _id!: string;
}

export class DataAddressBulkDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => DataAddressManageDto)
  list!: DataAddressManageDto[];
}

export class DataAddressUpdateManyDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => DataAddressUpdateDto)
  list!: DataAddressUpdateDto[];
}
