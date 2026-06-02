import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { FeedService } from '../feed.service';
import {
  CreateFeedStockDto,
  UpdateFeedStockDto,
  CreateFeedReceiveDto,
  CreateFeedDispenseDto,
  FeedQueryDto,
} from '../dtos/feed.dto';

@ApiTags('feed')
@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('stocks')
  async getStocks(@Query() query: FeedQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.getStocks(query));
  }

  @Post('stocks')
  async createStock(@Body() dto: CreateFeedStockDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.createStock(dto));
  }

  @Put('stocks/:id')
  async updateStock(@Param('id') id: string, @Body() dto: UpdateFeedStockDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.updateStock(id, dto));
  }

  @Delete('stocks/:id')
  async deleteStock(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.deleteStock(id));
  }

  @Get('receives')
  async getReceives(@Query() query: FeedQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.getReceives(query));
  }

  @Post('receives')
  async createReceive(@Body() dto: CreateFeedReceiveDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.createReceive(dto));
  }

  @Delete('receives/:id')
  async deleteReceive(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.deleteReceive(id));
  }

  @Get('dispenses')
  async getDispenses(@Query() query: FeedQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.getDispenses(query));
  }

  @Post('dispenses')
  async createDispense(@Body() dto: CreateFeedDispenseDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.createDispense(dto));
  }

  @Delete('dispenses/:id')
  async deleteDispense(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.feedService.deleteDispense(id));
  }
}
