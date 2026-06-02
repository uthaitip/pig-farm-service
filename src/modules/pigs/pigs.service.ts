import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pen } from 'src/schemas/pen.schema';
import { PigReceive } from 'src/schemas/pig-receive.schema';
import { PigSale } from 'src/schemas/pig-sale.schema';
import { PigTransfer } from 'src/schemas/pig-transfer.schema';
import { PigWeight } from 'src/schemas/pig-weight.schema';
import { PigHealth } from 'src/schemas/pig-health.schema';
import { Buyer } from 'src/schemas/buyer.schema';
import {
  CreatePigReceiveDto,
  CreatePigSaleDto,
  CreatePigTransferDto,
  CreatePigWeightDto,
  CreatePigHealthDto,
  PigQueryDto,
} from './dtos/pig.dto';

@Injectable()
export class PigsService {
  constructor(
    @InjectModel(Pen.name) private readonly penModel: Model<Pen>,
    @InjectModel(PigReceive.name) private readonly receiveModel: Model<PigReceive>,
    @InjectModel(PigSale.name) private readonly saleModel: Model<PigSale>,
    @InjectModel(PigTransfer.name) private readonly transferModel: Model<PigTransfer>,
    @InjectModel(PigWeight.name) private readonly weightModel: Model<PigWeight>,
    @InjectModel(PigHealth.name) private readonly healthModel: Model<PigHealth>,
    @InjectModel(Buyer.name) private readonly buyerModel: Model<Buyer>,
  ) {}

  async getReceives(query: PigQueryDto) {
    const filter: any = {};
    if (query.penId) filter.penId = query.penId;
    const where = filter;
    const orQuery = query.search
      ? [
          { source: { $regex: new RegExp(query.search), $options: 'i' } },
          { penName: { $regex: new RegExp(query.search), $options: 'i' } },
        ]
      : [];
    const finalWhere = orQuery.length ? { ...where, $or: orQuery } : where;
    const result = await (this.receiveModel as any).paginate(finalWhere, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createReceive(dto: CreatePigReceiveDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    if (pen.currentCount + dto.quantity > pen.capacity)
      throw new BadRequestException(`คอกเต็มแล้ว (ว่าง ${pen.capacity - pen.currentCount} ตัว)`);
    pen.currentCount += dto.quantity;
    await pen.save();
    return this.receiveModel.create({
      ...dto,
      penName: pen.name,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteReceive(id: string) {
    const doc = await this.receiveModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    const pen = await this.penModel.findById(doc.penId);
    if (pen) { pen.currentCount = Math.max(0, pen.currentCount - doc.quantity); await pen.save(); }
    return this.receiveModel.deleteOne({ _id: id });
  }

  async getSales(query: PigQueryDto) {
    const filter: any = {};
    if (query.penId) filter.penId = query.penId;
    const orQuery = query.search
      ? [
          { penName: { $regex: new RegExp(query.search), $options: 'i' } },
          { buyer: { $regex: new RegExp(query.search), $options: 'i' } },
        ]
      : [];
    const finalWhere = orQuery.length ? { ...filter, $or: orQuery } : filter;
    const result = await (this.saleModel as any).paginate(finalWhere, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createSale(dto: CreatePigSaleDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    if (dto.quantity > pen.currentCount)
      throw new BadRequestException(`คอกมีหมูแค่ ${pen.currentCount} ตัว`);
    let buyerName: string | undefined;
    if (dto.buyerId) {
      const buyer = await this.buyerModel.findById(dto.buyerId);
      buyerName = buyer?.name || undefined;
    }
    pen.currentCount -= dto.quantity;
    await pen.save();
    return this.saleModel.create({
      ...dto,
      penName: pen.name,
      buyer: buyerName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteSale(id: string) {
    const doc = await this.saleModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    const pen = await this.penModel.findById(doc.penId);
    if (pen) { pen.currentCount += doc.quantity; await pen.save(); }
    return this.saleModel.deleteOne({ _id: id });
  }

  async getTransfers(query: PigQueryDto) {
    const orQuery = query.search
      ? [
          { fromPenName: { $regex: new RegExp(query.search), $options: 'i' } },
          { toPenName: { $regex: new RegExp(query.search), $options: 'i' } },
        ]
      : [];
    const where = orQuery.length ? { $or: orQuery } : {};
    const result = await (this.transferModel as any).paginate(where, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createTransfer(dto: CreatePigTransferDto) {
    if (dto.fromPenId === dto.toPenId) throw new BadRequestException('คอกต้นทางและปลายทางต้องไม่ใช่คอกเดียวกัน');
    const fromPen = await this.penModel.findById(dto.fromPenId);
    if (!fromPen) throw new NotFoundException('ไม่พบคอกต้นทาง');
    if (dto.quantity > fromPen.currentCount)
      throw new BadRequestException(`คอกต้นทางมีหมูแค่ ${fromPen.currentCount} ตัว`);
    const toPen = await this.penModel.findById(dto.toPenId);
    if (!toPen) throw new NotFoundException('ไม่พบคอกปลายทาง');
    if (toPen.currentCount + dto.quantity > toPen.capacity)
      throw new BadRequestException(`คอกปลายทางว่างแค่ ${toPen.capacity - toPen.currentCount} ตัว`);
    fromPen.currentCount -= dto.quantity;
    toPen.currentCount += dto.quantity;
    await fromPen.save();
    await toPen.save();
    return this.transferModel.create({
      ...dto,
      fromPenName: fromPen.name,
      toPenName: toPen.name,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteTransfer(id: string) {
    const doc = await this.transferModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    const fromPen = await this.penModel.findById(doc.fromPenId);
    const toPen = await this.penModel.findById(doc.toPenId);
    if (fromPen) { fromPen.currentCount += doc.quantity; await fromPen.save(); }
    if (toPen) { toPen.currentCount = Math.max(0, toPen.currentCount - doc.quantity); await toPen.save(); }
    return this.transferModel.deleteOne({ _id: id });
  }

  async getWeights(query: PigQueryDto) {
    const filter: any = {};
    if (query.penId) filter.penId = query.penId;
    const result = await (this.weightModel as any).paginate(filter, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createWeight(dto: CreatePigWeightDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    return this.weightModel.create({ ...dto, penName: pen.name, createdAt: new Date().toISOString() });
  }

  async deleteWeight(id: string) {
    const doc = await this.weightModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    return this.weightModel.deleteOne({ _id: id });
  }

  async getHealths(query: PigQueryDto) {
    const filter: any = {};
    if (query.penId) filter.penId = query.penId;
    const result = await (this.healthModel as any).paginate(filter, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createHealth(dto: CreatePigHealthDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    return this.healthModel.create({ ...dto, penName: pen.name, createdAt: new Date().toISOString() });
  }

  async deleteHealth(id: string) {
    const doc = await this.healthModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    return this.healthModel.deleteOne({ _id: id });
  }
}
