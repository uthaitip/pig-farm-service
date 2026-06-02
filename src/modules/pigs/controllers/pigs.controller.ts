import { Body, Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { PigsService } from '../pigs.service';
import {
  CreatePigReceiveDto,
  CreatePigSaleDto,
  CreatePigTransferDto,
  CreatePigWeightDto,
  CreatePigHealthDto,
  PigQueryDto,
} from '../dtos/pig.dto';

@ApiTags('pigs')
@Controller()
export class PigsController {
  constructor(private readonly pigsService: PigsService) {}

  @Get('receives')
  async getReceives(@Query() query: PigQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.getReceives(query));
  }

  @Post('receives')
  async createReceive(@Body() dto: CreatePigReceiveDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.createReceive(dto));
  }

  @Delete('receives/:id')
  async deleteReceive(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.deleteReceive(id));
  }

  @Get('sales')
  async getSales(@Query() query: PigQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.getSales(query));
  }

  @Post('sales')
  async createSale(@Body() dto: CreatePigSaleDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.createSale(dto));
  }

  @Delete('sales/:id')
  async deleteSale(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.deleteSale(id));
  }

  @Get('transfers')
  async getTransfers(@Query() query: PigQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.getTransfers(query));
  }

  @Post('transfers')
  async createTransfer(@Body() dto: CreatePigTransferDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.createTransfer(dto));
  }

  @Delete('transfers/:id')
  async deleteTransfer(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.deleteTransfer(id));
  }

  @Get('weights')
  async getWeights(@Query() query: PigQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.getWeights(query));
  }

  @Post('weights')
  async createWeight(@Body() dto: CreatePigWeightDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.createWeight(dto));
  }

  @Delete('weights/:id')
  async deleteWeight(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.deleteWeight(id));
  }

  @Get('healths')
  async getHealths(@Query() query: PigQueryDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.getHealths(query));
  }

  @Post('healths')
  async createHealth(@Body() dto: CreatePigHealthDto, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.createHealth(dto));
  }

  @Delete('healths/:id')
  async deleteHealth(@Param('id') id: string, @Res() res: Response) {
    return MyResponse.sendOk(res, await this.pigsService.deleteHealth(id));
  }
}
