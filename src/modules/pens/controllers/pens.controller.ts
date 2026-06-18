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
import { PensService } from 'src/services/pens.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreatePenDto, UpdatePenDto } from '../dtos/pen.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pen } from 'src/schemas/pen.schema';
import { syncPenStatus } from 'src/libraries/pen-utils';

@ApiTags('pens')
@Controller()
export class PensController {
  constructor(
    private service: PensService,
    @InjectModel(Pen.name) private penModel: Model<Pen>,
  ) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const filter = query.parsedFilter();
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter: filter,
      search: query.search,
    });
    const mapped = {
      ...result,
      list: result.list.map((pen) => this.withStatusPens(pen)),
    };
    return MyResponse.sendOk(res, mapped);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลคอก');
    return MyResponse.sendOk(res, this.withStatusPens(item));
  }

  private withStatusPens(pen: any) {
    const isFull = pen.capacity > 0 && pen.currentCount >= pen.capacity;
    return { ...pen.toObject?.() ?? pen, statusPens: isFull ? 'isFull' : 'notFull' };
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreatePenDto) {
    const result = await this.service.insertWithRunning(body, 'penCode', 5, 'P');
    await syncPenStatus(this.penModel, result._id);
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdatePenDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลคอก');
    const update = await this.service.setById(item._id, body);
    await syncPenStatus(this.penModel, item._id);
    return MyResponse.sendOk(res, update);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลคอก');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
