import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pen } from 'src/schemas/pen.schema';
import { FeedStock } from 'src/schemas/feed-stock.schema';
import { FeedReceive } from 'src/schemas/feed-receive.schema';
import { FeedDispense } from 'src/schemas/feed-dispense.schema';
import {
  CreateFeedStockDto,
  UpdateFeedStockDto,
  CreateFeedReceiveDto,
  CreateFeedDispenseDto,
  FeedQueryDto,
} from './dtos/feed.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Pen.name) private readonly penModel: Model<Pen>,
    @InjectModel(FeedStock.name) private readonly stockModel: Model<FeedStock>,
    @InjectModel(FeedReceive.name) private readonly receiveModel: Model<FeedReceive>,
    @InjectModel(FeedDispense.name) private readonly dispenseModel: Model<FeedDispense>,
  ) {}

  async getStocks(query: FeedQueryDto) {
    const orQuery = query.search
      ? [{ name: { $regex: new RegExp(query.search), $options: 'i' } }]
      : [];
    const where = orQuery.length ? { $or: orQuery } : {};
    const result = await (this.stockModel as any).paginate(where, {
      page: query.page || 1,
      limit: query.limit || 100,
      sort: { name: 1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createStock(dto: CreateFeedStockDto) {
    return this.stockModel.create({
      ...dto,
      quantity: 0,
      minQuantity: dto.minQuantity || 0,
      status: 'active',
    });
  }

  async updateStock(id: string, dto: UpdateFeedStockDto) {
    const doc = await this.stockModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');
    return this.stockModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...dto, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' },
    );
  }

  async deleteStock(id: string) {
    const doc = await this.stockModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');
    return this.stockModel.deleteOne({ _id: id });
  }

  async getReceives(query: FeedQueryDto) {
    const orQuery = query.search
      ? [{ feedName: { $regex: new RegExp(query.search), $options: 'i' } },
         { supplier: { $regex: new RegExp(query.search), $options: 'i' } }]
      : [];
    const where: Record<string, any> = {};
    if (orQuery.length)    where.$or = orQuery;
    if (query.feedStockId) where.feedStockId = query.feedStockId;
    const result = await (this.receiveModel as any).paginate(where, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createReceive(dto: CreateFeedReceiveDto) {
    const stock = await this.stockModel.findById(dto.feedStockId);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');
    stock.quantity += dto.quantity;
    stock.updatedAt = new Date().toISOString();
    await stock.save();
    return this.receiveModel.create({
      ...dto,
      feedName: stock.name,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteReceive(id: string) {
    const doc = await this.receiveModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    const stock = await this.stockModel.findById(doc.feedStockId);
    if (stock) {
      stock.quantity = Math.max(0, stock.quantity - doc.quantity);
      stock.updatedAt = new Date().toISOString();
      await stock.save();
    }
    return this.receiveModel.deleteOne({ _id: id });
  }

  async getDispenses(query: FeedQueryDto) {
    const orQuery = query.search
      ? [{ feedName: { $regex: new RegExp(query.search), $options: 'i' } },
         { penName: { $regex: new RegExp(query.search), $options: 'i' } }]
      : [];
    const where: Record<string, any> = {};
    if (orQuery.length)    where.$or = orQuery;
    if (query.feedStockId) where.feedStockId = query.feedStockId;
    const result = await (this.dispenseModel as any).paginate(where, {
      page: query.page || 1,
      limit: query.limit || 20,
      sort: { date: -1, _id: -1 },
    });
    return { list: result.docs, total: result.totalDocs, page: result.page, pages: result.totalPages };
  }

  async createDispense(dto: CreateFeedDispenseDto) {
    const stock = await this.stockModel.findById(dto.feedStockId);
    if (!stock) throw new NotFoundException('ไม่พบข้อมูลสต็อกอาหาร');
    if (stock.quantity < dto.quantity)
      throw new BadRequestException(`สต็อกอาหารเหลือแค่ ${stock.quantity} ${stock.unit || ''}`);
    const pen = await this.penModel.findById(dto.penId);
    if (!pen) throw new NotFoundException('ไม่พบข้อมูลคอก');
    stock.quantity -= dto.quantity;
    stock.updatedAt = new Date().toISOString();
    await stock.save();
    return this.dispenseModel.create({
      ...dto,
      feedName: stock.name,
      penName: pen.name,
      createdAt: new Date().toISOString(),
    });
  }

  async deleteDispense(id: string) {
    const doc = await this.dispenseModel.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบรายการ');
    const stock = await this.stockModel.findById(doc.feedStockId);
    if (stock) {
      stock.quantity += doc.quantity;
      stock.updatedAt = new Date().toISOString();
      await stock.save();
    }
    return this.dispenseModel.deleteOne({ _id: id });
  }
}
