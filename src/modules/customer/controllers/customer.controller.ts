import MyResponse from 'src/libraries/my-response';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/crud.dto';
import { CustomerService } from 'src/services/customer.service';
import { DeleteManyDto } from 'src/dtos/delete-many.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { Response } from 'express';
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

@ApiTags('customers')
@Controller()
export class CustomerController {
  constructor(private service: CustomerService) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const filter = query.filter || {};
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter: filter,
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException();
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateCustomerDto) {
    const result = await this.service.insert({ ...body, status: 'active' });
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdateCustomerDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลลูกค้า');
    const update = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, update);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลลูกค้า');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }

  @Delete()
  async deleteMany(@Query() query: DeleteManyDto, @Res() res: Response) {
    const deleted = await this.service.deleteManyById(query.identities);
    return MyResponse.sendOk(res, deleted);
  }
}
