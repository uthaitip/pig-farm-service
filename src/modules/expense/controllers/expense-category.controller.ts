import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { ExpenseCategoryService } from 'src/services/expense-category.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from '../dtos/expense-category.dto';

@ApiTags('expense-categories')
@Controller()
export class ExpenseCategoryController {
  constructor(private service: ExpenseCategoryService) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const pagination = query.toPagination();
    if (!query.limit) pagination.limit = 999;
    if (!query.sort) pagination.sort = { code: 1 };
    const result = await this.service.pagination({
      pagination,
      filter: query.parsedFilter(),
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateExpenseCategoryDto) {
    const result = await this.service.insert({
      code:        body.code.toUpperCase().trim(),
      name:        body.name,
      description: body.description ?? null,
      isActive:    true,
    });
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateExpenseCategoryDto) {
    const cat = await this.service.findByIdentity(id);
    if (!cat) throw new NotFoundException('ไม่พบหมวดหมู่รายจ่าย');
    const result = await this.service.setById((cat as any)._id, body);
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const cat = await this.service.findByIdentity(id);
    if (!cat) throw new NotFoundException('ไม่พบหมวดหมู่รายจ่าย');
    const result = await this.service.deleteById((cat as any)._id);
    return MyResponse.sendOk(res, result);
  }
}
