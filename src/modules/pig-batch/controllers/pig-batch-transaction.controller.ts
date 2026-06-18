import {
  BadRequestException,
  Body,
  Controller,
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
import { Pen } from 'src/schemas/pen.schema';
import { PigBatchTransactionService } from 'src/services/pig-batch-transaction.service';
import { PigBatchService } from 'src/services/pig-batch.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreatePigBatchTransactionDto } from '../dtos/pig-batch-transaction.dto';
import { syncPenStatus } from 'src/libraries/pen-utils';

@ApiTags('pig-batch-transactions')
@Controller('transactions')
export class PigBatchTransactionController {
  constructor(
    private txService: PigBatchTransactionService,
    private batchService: PigBatchService,
    @InjectModel(Pen.name) private penModel: Model<Pen>,
  ) {}

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const result = await this.txService.pagination({
      pagination: query.toPagination(),
      filter: query.parsedFilter(),
      search: query.search,
    });
    return MyResponse.sendOk(res, result);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreatePigBatchTransactionDto) {
    const batch = await this.batchService.findByIdentity(body.batchId);
    if (!batch) throw new NotFoundException('ไม่พบข้อมูลรุ่นหมู');

    const batchPen = await this.penModel.findById(batch.penId);
    if (!batchPen) throw new NotFoundException('ไม่พบข้อมูลคอก');

    // เช็ค capacity สำหรับ transaction ที่เพิ่มหมูในคอก
    if (['RECEIVE', 'MOVE_IN'].includes(body.transactionType)) {
      if (batchPen.capacity > 0 && batchPen.currentCount + body.quantity > batchPen.capacity) {
        const remaining = batchPen.capacity - batchPen.currentCount;
        throw new BadRequestException(
          `คอกนี้รับได้อีกแค่ ${remaining} ตัว (ความจุ ${batchPen.capacity} ตัว, มีอยู่แล้ว ${batchPen.currentCount} ตัว)`,
        );
      }
    }

    const tx = await this.txService.insert(body);

    // คำนวณ delta สำหรับ batch.currentQuantity
    let delta = 0;
    if (['RECEIVE', 'MOVE_IN', 'ADJUST'].includes(body.transactionType)) delta = body.quantity;
    else if (['DEAD', 'SOLD', 'MOVE_OUT'].includes(body.transactionType)) delta = -body.quantity;

    const penUpdates: Promise<any>[] = [];

    if (delta !== 0) {
      // อัปเดต currentQuantity ใน batch
      await this.batchService.setById(batch._id, {
        currentQuantity: Math.max(0, (batch.currentQuantity ?? 0) + delta),
      });

      // อัปเดต currentCount บนคอกของ batch
      penUpdates.push(
        this.penModel.findByIdAndUpdate(batchPen._id, { $inc: { currentCount: delta } }),
      );
    }

    // MOVE_IN: ลด currentCount ของคอกต้นทาง
    if (body.transactionType === 'MOVE_IN' && body.fromPenId) {
      penUpdates.push(
        this.penModel.findByIdAndUpdate(body.fromPenId, { $inc: { currentCount: -body.quantity } }),
      );
    }

    // MOVE_OUT: เพิ่ม currentCount ของคอกปลายทาง
    if (body.transactionType === 'MOVE_OUT' && body.toPenId) {
      penUpdates.push(
        this.penModel.findByIdAndUpdate(body.toPenId, { $inc: { currentCount: body.quantity } }),
      );
    }

    if (penUpdates.length > 0) await Promise.all(penUpdates);

    // sync statusPens สำหรับทุกคอกที่ถูกแตะ
    const penIds = new Set<string>([batchPen._id.toString()]);
    if (body.transactionType === 'MOVE_IN' && body.fromPenId) penIds.add(body.fromPenId);
    if (body.transactionType === 'MOVE_OUT' && body.toPenId) penIds.add(body.toPenId);
    await Promise.all([...penIds].map((id) => syncPenStatus(this.penModel, id)));

    return MyResponse.sendOk(res, tx);
  }
}
