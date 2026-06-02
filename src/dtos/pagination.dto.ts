import { AnyObject } from 'src/libraries/object';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateOptions } from 'mongoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Pagination {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  page: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  limit: string;
}

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Pagination)
  pagination: Pagination;

  @IsOptional()
  page: string;

  @IsOptional()
  limit: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  filter: AnyObject;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  searchs: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  identities: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  sort: AnyObject;

  toPagination(): {
    page: number;
    limit: number;
    sort: AnyObject;
  } {
    const paginationOptions: any = {};
    if (this.pagination) {
      paginationOptions.page = Number(this.pagination.page);
      paginationOptions.limit = Number(this.pagination.limit);
    } else {
      if (this.page) {
        paginationOptions.page = Number(this.page);
      } else {
        paginationOptions.page = 1;
      }
      if (this.limit) {
        paginationOptions.limit = Number(this.limit);
      } else {
        paginationOptions.limit = 10;
      }
      if (this.identities) {
        paginationOptions.limit = this.identities.length;
      }
    }

    if (this.sort) {
      paginationOptions.sort = this.sort;
    } else {
      paginationOptions.sort = {
        _id: -1,
      };
    }
    return paginationOptions as {
      page: number;
      limit: number;
      sort: AnyObject;
    };
  }
}

export const FilterKey = {
  isNull: 'isNull',
  isNotNull: 'isNotNull',
  isNot: 'isNot',
  isArrayEmpty: 'isArrayEmpty',
  //
  isLowerThan: 'isLt',
  isLowerThanEqual: 'isLte',
  isGreaterThan: 'isGt',
  isGreaterThanEqual: 'isGte',
};
