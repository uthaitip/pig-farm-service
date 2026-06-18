import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { ExpenseService } from 'src/services/expense.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateExpenseDto } from '../dtos/expense.dto';

@ApiTags('expenses')
@Controller()
export class ExpenseController {
  constructor(private service: ExpenseService) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter:     query.parsedFilter(),
      search:     query.search,
      populates:  [{ path: 'expenseCategoryId', select: 'code name' }],
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const expense = await this.service.findByIdentity(id, {
      populates: [{ path: 'expenseCategoryId', select: 'code name' }],
    });
    if (!expense) throw new NotFoundException('ไม่พบรายการรายจ่าย');
    return MyResponse.sendOk(res, expense);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateExpenseDto) {
    const result = await this.service.insertWithRunning(
      {
        expenseCategoryId: body.expenseCategoryId,
        expenseDate:       body.expenseDate,
        amount:            body.amount,
        description:       body.description ?? null,
        attachment:        body.attachment  ?? null,
        createdBy:         null,
      },
      'expenseNo', 8, 'EXP',
    );
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const expense = await this.service.findByIdentity(id);
    if (!expense) throw new NotFoundException('ไม่พบรายการรายจ่าย');
    const result = await this.service.deleteById((expense as any)._id);
    return MyResponse.sendOk(res, result);
  }
}
