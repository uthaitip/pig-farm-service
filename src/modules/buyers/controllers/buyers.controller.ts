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
import { BuyersService } from 'src/services/buyers.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateBuyerDto, UpdateBuyerDto } from '../dtos/buyer.dto';

@ApiTags('buyers')
@Controller()
export class BuyersController {
  constructor(private service: BuyersService) {}

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
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้รับซื้อ');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateBuyerDto) {
    const result = await this.service.create(body);
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdateBuyerDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้รับซื้อ');
    const update = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, update);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้รับซื้อ');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
