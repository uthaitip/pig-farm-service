import {
  BadRequestException,
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
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Model } from 'mongoose';
import MyResponse from 'src/libraries/my-response';
import { Pen } from 'src/schemas/pen.schema';
import { PigBatchService } from 'src/services/pig-batch.service';
import { PigBatchTransactionService } from 'src/services/pig-batch-transaction.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CreatePigBatchDto, UpdatePigBatchDto } from '../dtos/pig-batch.dto';
import { syncPenStatus } from 'src/libraries/pen-utils';

@ApiTags('pig-batches')
@Controller()
export class PigBatchController {
  constructor(
    private service: PigBatchService,
    private txService: PigBatchTransactionService,
    @InjectModel(Pen.name) private penModel: Model<Pen>,
  ) {}

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
    if (!item) throw new NotFoundException('ไม่พบข้อมูลรุ่นหมู');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreatePigBatchDto) {
    const pen = await this.penModel.findById(body.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    if (
      pen.capacity > 0 &&
      pen.currentCount + body.initialQuantity > pen.capacity
    ) {
      const remaining = pen.capacity - pen.currentCount;
      throw new BadRequestException(
        `คอกนี้รับได้อีกแค่ ${remaining} ตัว (ความจุ ${pen.capacity} ตัว, มีอยู่แล้ว ${pen.currentCount} ตัว)`,
      );
    }

    const batch = await this.service.insertWithRunning(
      { ...body, currentQuantity: body.initialQuantity, status: 'ACTIVE' },
      'batchCode',
      8,
      'B',
    );
    await Promise.all([
      this.txService.insert({
        batchId: batch._id,
        transactionType: 'RECEIVE',
        quantity: body.initialQuantity,
        transactionDate: body.receivedDate,
        remark: `รับเข้าอัตโนมัติ เมื่อสร้างรุ่น ${batch.batchCode}`,
      }),
      this.penModel.findByIdAndUpdate(pen._id, {
        $inc: { currentCount: body.initialQuantity },
      }),
    ]);
    await syncPenStatus(this.penModel, pen._id);
    return MyResponse.sendOk(res, batch);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdatePigBatchDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลรุ่นหมู');
    const result = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลรุ่นหมู');
    const result = await this.service.deleteById(item._id);
    // คืน currentCount กลับไปที่คอก
    if (item.penId && (item.currentQuantity ?? 0) > 0) {
      await this.penModel.findByIdAndUpdate(item.penId, {
        $inc: { currentCount: -(item.currentQuantity ?? 0) },
      });
      await syncPenStatus(this.penModel, item.penId);
    }
    return MyResponse.sendOk(res, result);
  }
}
