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
import { MasterHouseTypeService } from 'src/services/master-house-types.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateMasterHouseType } from '../dtos/crud.dto';

@ApiTags('master-house-types')
@Controller()
export class MasterHouseTypeController {
  constructor(private service: MasterHouseTypeService) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter: query.parsedFilter(),
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลประเภทคอก');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateMasterHouseType) {
    const result = await this.service.insertWithRunning(
      { ...body, status: body.status ?? 'active' },
      'code',
      5,
      'HT',
    );
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: CreateMasterHouseType,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลประเภทคอก');
    const updated = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, updated);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลประเภทคอก');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
