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
import { TodoService } from 'src/services/todo.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateTodoDto } from '../dtos/todo.dto';

@ApiTags('todos')
@Controller()
export class TodoController {
  constructor(private service: TodoService) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter: query.filter || {},
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findById(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูล');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateTodoDto) {
    const result = await this.service.insert(body);
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: CreateTodoDto,
  ) {
    const item = await this.service.findById(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูล');
    const updated = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, updated);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findById(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูล');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
