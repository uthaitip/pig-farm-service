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
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Model } from 'mongoose';
import MyResponse from 'src/libraries/my-response';
import { SaleService } from 'src/services/sale.service';
import { SaleDetailService } from 'src/services/sale-detail.service';
import { PigBatchService } from 'src/services/pig-batch.service';
import { PigBatchTransactionService } from 'src/services/pig-batch-transaction.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreateSaleDto } from '../dtos/sale.dto';
import { Pen } from 'src/schemas/pen.schema';
import { syncPenStatus } from 'src/libraries/pen-utils';

@ApiTags('sales')
@Controller()
export class SaleController {
  constructor(
    private saleService: SaleService,
    private detailService: SaleDetailService,
    private batchService: PigBatchService,
    private txService: PigBatchTransactionService,
    @InjectModel(Pen.name) private penModel: Model<Pen>,
  ) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const result = await this.saleService.pagination({
      pagination: query.toPagination(),
      filter: query.parsedFilter(),
      search: query.search,
      populates: [{ path: 'customerId', select: 'customerCode customerName' }],
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const sale = await this.saleService.findByIdentity(id, {
      populates: [{ path: 'customerId', select: 'customerCode customerName phoneNumber' }],
    });
    if (!sale) throw new NotFoundException('ไม่พบข้อมูลการขาย');
    const details = await this.detailService.find({ saleId: (sale as any)._id }, {
      populates: [{ path: 'batchId', select: 'batchCode batchName' }],
    });
    return MyResponse.sendOk(res, { ...sale, details });
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateSaleDto) {
    const totalQuantity = body.details.reduce((s, d) => s + d.quantity, 0);
    const totalAmount   = body.details.reduce((s, d) => s + d.amount, 0);

    // 1. สร้าง Sale
    const sale = await this.saleService.insertWithRunning(
      {
        customerId:    body.customerId,
        saleDate:      body.saleDate,
        totalQuantity,
        totalAmount,
        status:        body.status ?? 'COMPLETED',
        note:          body.note ?? null,
      },
      'saleNo', 8, 'SAL',
    );

    // 2. ต่อ detail: SaleDetail + PigBatchEvent(SOLD) + ลด currentQuantity
    for (const detail of body.details) {
      const batch = await this.batchService.findByIdentity(detail.batchId);
      if (!batch) throw new NotFoundException(`ไม่พบรุ่นหมู ${detail.batchId}`);

      await this.detailService.insert({
        saleId:        sale._id,
        batchId:       batch._id,
        quantity:      detail.quantity,
        averageWeight: detail.averageWeight ?? null,
        totalWeight:   detail.totalWeight   ?? null,
        pricePerKg:    detail.pricePerKg    ?? null,
        amount:        detail.amount,
      });

      await this.txService.insert({
        batchId:         batch._id,
        transactionType: 'SOLD',
        quantity:        detail.quantity,
        transactionDate: body.saleDate,
        remark:          `ขาย ${detail.quantity} ตัว เลขที่ ${sale.saleNo}`,
      });

      const newQty = Math.max(0, (batch.currentQuantity ?? 0) - detail.quantity);
      const batchUpdate: any = { currentQuantity: newQty };
      if (newQty === 0) {
        batchUpdate.status = 'CLOSED';
        // reset คอกที่ batch นี้อยู่
        await this.penModel.findByIdAndUpdate(batch.penId, {
          currentCount: 0,
          statusPens: 'notFull',
        });
      }
      await this.batchService.setById(batch._id, batchUpdate);
    }

    return MyResponse.sendOk(res, sale);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const sale = await this.saleService.findByIdentity(id);
    if (!sale) throw new NotFoundException('ไม่พบข้อมูลการขาย');
    if ((sale as any).status === 'CANCELLED') throw new BadRequestException('รายการนี้ถูกยกเลิกไปแล้ว');

    // คืนของกลับทุก detail
    const details = await this.detailService.find({ saleId: (sale as any)._id });
    for (const detail of details) {
      const batch = await this.batchService.findByIdentity((detail as any).batchId.toString());
      if (!batch) continue;

      const restoredQty = (batch.currentQuantity ?? 0) + (detail as any).quantity;
      const batchUpdate: any = { currentQuantity: restoredQty };
      if (batch.status === 'CLOSED') batchUpdate.status = 'ACTIVE';
      await this.batchService.setById(batch._id, batchUpdate);

      await this.penModel.findByIdAndUpdate(batch.penId, {
        $inc: { currentCount: (detail as any).quantity },
      });
      await syncPenStatus(this.penModel, batch.penId);
    }

    const result = await this.saleService.setById((sale as any)._id, { status: 'CANCELLED' });
    return MyResponse.sendOk(res, result);
  }
}
