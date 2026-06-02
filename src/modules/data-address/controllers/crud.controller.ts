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
import { DataAddressService } from 'src/services/data-address.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import {
  DataAddressManageDto as ManageDto,
  DataAddressUpdateIsActiveDto,
} from '../dtos/crud.dto';

@ApiTags('data-addresses')
@Controller()
export class CrudController {
  constructor(private service: DataAddressService) {}

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
    if (!item) throw new NotFoundException('ไม่พบข้อมูลที่อยู่');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: ManageDto) {
    const result = await this.service.insert({ ...body });
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: ManageDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลที่อยู่');
    const update = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, update);
  }

  @Put(':id/is-active')
  async updateStatus(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: DataAddressUpdateIsActiveDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลที่อยู่');
    const update = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, update);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลที่อยู่');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
