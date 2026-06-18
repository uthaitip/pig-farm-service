import {
  BadRequestException,
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
import { FeedStockService } from 'src/services/feed-stock.service';
import { FeedStockTransactionService } from 'src/services/feed-stock-transaction.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateTransactionDto, CreateAdjustDto } from '../dtos/feed-stock-transaction.dto';

@ApiTags('feed-stocks')
@Controller()
export class FeedStockController {
  constructor(
    private stockService: FeedStockService,
    private txService: FeedStockTransactionService,
  ) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const pagination = query.toPagination();
    if (!query.limit) pagination.limit = 999;
    const result = await this.stockService.pagination({
      pagination,
      filter: query.parsedFilter(),
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id/transactions')
  async getTransactions(
    @Param('id') id: string,
    @Res() res: Response,
    @Query() query: PaginationDto,
  ) {
    const stock = await this.stockService.findById(id, {
      populates: [{ path: 'feedTypeId' }],
    });
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');

    const pagination = query.toPagination();
    if (!pagination.sort) pagination.sort = { transactionDate: -1, _id: -1 };
    const feedTypeId = stock.feedTypeId;
    const result = await this.txService.pagination({
      pagination,
      filter: { feedTypeId },
      search: query.search,
    });
    return MyResponse.sendOk(res, { stock, ...result });
  }

  @Post(':id/in')
  async receiveIn(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: CreateTransactionDto,
  ) {
    const stock = await this.stockService.findById(id);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');

    await this.stockService.incrementQuantity(stock._id, body.quantity);

    const tx = await this.txService.insert({
      feedTypeId: stock.feedTypeId,
      transactionType: 'IN',
      transactionDate: body.transactionDate,
      quantity: body.quantity,
      unitPrice: body.unitPrice ?? null,
      totalAmount: body.totalAmount ?? null,
      note: body.note ?? null,
    });
    return MyResponse.sendOk(res, tx);
  }

  @Post(':id/out')
  async dispenseOut(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: CreateTransactionDto,
  ) {
    const stock = await this.stockService.findById(id);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');

    const updated = await this.stockService.decrementQuantity(stock._id, body.quantity);
    if (!updated) {
      throw new BadRequestException(
        `สต็อกเหลือแค่ ${stock.currentQuantity} หน่วย ไม่สามารถเบิกได้`,
      );
    }

    const tx = await this.txService.insert({
      feedTypeId: stock.feedTypeId,
      transactionType: 'OUT',
      transactionDate: body.transactionDate,
      quantity: body.quantity,
      batchId: body.batchId ?? null,
      note: body.note ?? null,
    });
    return MyResponse.sendOk(res, tx);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const stock = await this.stockService.findById(id);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');
    await this.stockService.deleteById(stock._id);
    return MyResponse.sendOk(res, { deleted: true });
  }

  @Post(':id/adjust')
  async adjust(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: CreateAdjustDto,
  ) {
    const stock = await this.stockService.findById(id);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');

    await this.stockService.adjustQuantity(stock._id, body.quantity);

    const tx = await this.txService.insert({
      feedTypeId: stock.feedTypeId,
      transactionType: 'ADJUST',
      transactionDate: body.transactionDate,
      quantity: body.quantity,
      note: body.note ?? null,
    });
    return MyResponse.sendOk(res, tx);
  }
}
