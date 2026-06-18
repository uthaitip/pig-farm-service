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
import { FeedTypeService } from 'src/services/feed-type.service';
import { FeedStockService } from 'src/services/feed-stock.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateFeedTypeDto, UpdateFeedTypeDto } from '../dtos/feed-type.dto';

@ApiTags('feed-types')
@Controller()
export class FeedTypeController {
  constructor(
    private feedTypeService: FeedTypeService,
    private feedStockService: FeedStockService,
  ) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const pagination = query.toPagination();
    const result = await this.feedTypeService.pagination({
      pagination,
      filter: query.parsedFilter(),
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateFeedTypeDto) {
    const feedType = await this.feedTypeService.insertWithRunning(
      {
        feedName: body.feedName,
        category: body.category,
        unit: body.unit ?? null,
        minimumQuantity: body.minimumQuantity ?? 0,
        description: body.description ?? null,
      },
      'feedCode',
      8,
      'FD',
    );

    await this.feedStockService.insert({
      feedTypeId: feedType._id,
      currentQuantity: 0,
    });

    return MyResponse.sendOk(res, feedType);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdateFeedTypeDto,
  ) {
    const feedType = await this.feedTypeService.findByIdentity(id);
    if (!feedType) throw new NotFoundException('ไม่พบข้อมูลประเภทอาหาร');
    const result = await this.feedTypeService.setById(feedType._id, body);
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const feedType = await this.feedTypeService.findByIdentity(id);
    if (!feedType) throw new NotFoundException('ไม่พบข้อมูลประเภทอาหาร');
    await this.feedStockService.deleteMany({ feedTypeId: feedType._id });
    const result = await this.feedTypeService.deleteById(feedType._id);
    return MyResponse.sendOk(res, result);
  }
}
