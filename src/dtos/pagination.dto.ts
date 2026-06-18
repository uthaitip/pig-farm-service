import { AnyObject } from 'src/libraries/object';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateOptions } from 'mongoose';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

function parseJsonString(value: any) {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

function parsePagination(value: any): { page: number; limit: number } | null {
  const raw = typeof value === 'string' ? parseJsonString(value) : value;
  if (!raw || typeof raw !== 'object') return null;
  const page = Number(raw.page);
  const limit = Number(raw.limit);
  return {
    page:  isNaN(page)  || page  < 1 ? 1  : page,
    limit: isNaN(limit) || limit < 1 ? 10 : limit,
  };
}

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parsePagination(value))
  pagination: { page: number; limit: number } | null;

  @IsOptional()
  page: string;

  @IsOptional()
  limit: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => parseJsonString(value))
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

  parsedPagination(): { page: number; limit: number } | null {
    return this.pagination ?? null;
  }

  parsedFilter(): AnyObject {
    if (!this.filter) return {};
    if (typeof this.filter === 'string') {
      try { return JSON.parse(this.filter as any); } catch { return {}; }
    }
    return this.filter;
  }

  toPagination(): {
    page: number;
    limit: number;
    sort: AnyObject;
  } {
    const paginationOptions: any = {};
    const pag = this.parsedPagination();
    if (pag) {
      paginationOptions.page  = pag.page;
      paginationOptions.limit = pag.limit;
    } else {
      paginationOptions.page  = this.page  ? Number(this.page)  : 1;
      paginationOptions.limit = this.limit ? Number(this.limit) : 10;
      if (this.identities) {
        paginationOptions.limit = this.identities.length;
      }
    }

    paginationOptions.sort = this.sort ?? { _id: -1 };

    return paginationOptions as { page: number; limit: number; sort: AnyObject };
  }
}

export const FilterKey = {
  isNull: 'isNull',
  isNotNull: 'isNotNull',
  isNot: 'isNot',
  isArrayEmpty: 'isArrayEmpty',
  isLowerThan: 'isLt',
  isLowerThanEqual: 'isLte',
  isGreaterThan: 'isGt',
  isGreaterThanEqual: 'isGte',
};
