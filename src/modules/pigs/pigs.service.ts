import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
type PaginateModel<T> = { paginate(query?: any, options?: any): Promise<any> };
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

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

  private async paginate<T>(
    model: Model<T>,
    where: Record<string, unknown>,
    query: PigQueryDto,
  ) {
    const result = await (model as unknown as PaginateModel<T>).paginate(where, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return {
      list: result.docs,
      total: result.totalDocs,
      page: result.page,
      pages: result.totalPages,
    };
  }

  async getReceives(query: PigQueryDto) {
    const filter: Record<string, unknown> = {};
    if (query.penId) filter.penId = query.penId;
    const orQuery = query.search
      ? [
          { source: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
          { penName: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
        ]
      : [];
    const where = orQuery.length ? { ...filter, $or: orQuery } : filter;
    return this.paginate(this.receiveModel, where, query);
  }

  async createReceive(dto: CreatePigReceiveDto) {
    const pen = await this.penModel.findOneAndUpdate(
      {
        _id: dto.penId,
        $expr: { $lte: [{ $add: ['$currentCount', dto.quantity] }, '$capacity'] },
      },
      { $inc: { currentCount: dto.quantity } },
      { new: true },
    );
    if (!pen) throw new BadRequestException('ไม่พบข้อมูลคอก หรือคอกเต็มแล้ว');
    return this.receiveModel.create({
      ...dto,
      penName: pen.penName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteReceive(id: string) {
    const doc = await this.receiveModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    await this.penModel.updateOne(
      { _id: doc.penId },
      [{ $set: { currentCount: { $max: [0, { $subtract: ['$currentCount', doc.quantity] }] } } }],
    );
    return { deletedCount: 1 };
  }

  async getSales(query: PigQueryDto) {
    const filter: Record<string, unknown> = {};
    if (query.penId) filter.penId = query.penId;
    const orQuery = query.search
      ? [
          { penName: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
          { buyer: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
        ]
      : [];
    const where = orQuery.length ? { ...filter, $or: orQuery } : filter;
    return this.paginate(this.saleModel, where, query);
  }

  async createSale(dto: CreatePigSaleDto) {
    const pen = await this.penModel.findOneAndUpdate(
      { _id: dto.penId, currentCount: { $gte: dto.quantity } },
      { $inc: { currentCount: -dto.quantity } },
      { new: true },
    );
    if (!pen) throw new BadRequestException('ไม่พบข้อมูลคอก หรือมีหมูในคอกไม่เพียงพอ');
    let buyerName: string | undefined;
    if (dto.buyerId) {
      const buyer = await this.buyerModel.findById(dto.buyerId);
      buyerName = buyer?.name || undefined;
    }
    return this.saleModel.create({
      ...dto,
      penName: pen.penName,
      buyer: buyerName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteSale(id: string) {
    const doc = await this.saleModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    await this.penModel.findByIdAndUpdate(doc.penId, {
      $inc: { currentCount: doc.quantity },
    });
    return { deletedCount: 1 };
  }

  async getTransfers(query: PigQueryDto) {
    const orQuery = query.search
      ? [
          { fromPenName: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
          { toPenName: { $regex: new RegExp(escapeRegex(query.search)), $options: 'i' } },
        ]
      : [];
    const where = orQuery.length ? { $or: orQuery } : {};
    return this.paginate(this.transferModel, where, query);
  }

  async createTransfer(dto: CreatePigTransferDto) {
    if (dto.fromPenId === dto.toPenId)
      throw new BadRequestException('คอกต้นทางและปลายทางต้องไม่ใช่คอกเดียวกัน');

    const fromPen = await this.penModel.findOneAndUpdate(
      { _id: dto.fromPenId, currentCount: { $gte: dto.quantity } },
      { $inc: { currentCount: -dto.quantity } },
      { new: true },
    );
    if (!fromPen) throw new BadRequestException('ไม่พบคอกต้นทาง หรือมีหมูในคอกไม่เพียงพอ');

    const toPen = await this.penModel.findOneAndUpdate(
      {
        _id: dto.toPenId,
        $expr: { $lte: [{ $add: ['$currentCount', dto.quantity] }, '$capacity'] },
      },
      { $inc: { currentCount: dto.quantity } },
      { new: true },
    );
    if (!toPen) {
      await this.penModel.findByIdAndUpdate(dto.fromPenId, {
        $inc: { currentCount: dto.quantity },
      });
      throw new BadRequestException('ไม่พบคอกปลายทาง หรือคอกปลายทางเต็มแล้ว');
    }

    return this.transferModel.create({
      ...dto,
      fromPenName: fromPen.penName,
      toPenName: toPen.penName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteTransfer(id: string) {
    const doc = await this.transferModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    await this.penModel.findByIdAndUpdate(doc.fromPenId, {
      $inc: { currentCount: doc.quantity },
    });
    await this.penModel.updateOne(
      { _id: doc.toPenId },
      [{ $set: { currentCount: { $max: [0, { $subtract: ['$currentCount', doc.quantity] }] } } }],
    );
    return { deletedCount: 1 };
  }

  async getWeights(query: PigQueryDto) {
    const filter: Record<string, unknown> = {};
    if (query.penId) filter.penId = query.penId;
    return this.paginate(this.weightModel, filter, query);
  }

  async createWeight(dto: CreatePigWeightDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    return this.weightModel.create({
      ...dto,
      penName: pen.penName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteWeight(id: string) {
    const doc = await this.weightModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    return { deletedCount: 1 };
  }

  async getHealths(query: PigQueryDto) {
    const filter: Record<string, unknown> = {};
    if (query.penId) filter.penId = query.penId;
    return this.paginate(this.healthModel, filter, query);
  }

  async createHealth(dto: CreatePigHealthDto) {
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    return this.healthModel.create({
      ...dto,
      penName: pen.penName,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteHealth(id: string) {
    const doc = await this.healthModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    return { deletedCount: 1 };
  }
}
