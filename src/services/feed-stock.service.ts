import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeedStock } from 'src/schemas/feed-stock.schema';
import { MongoService, TypePagination, TypePaginationResult } from './mongo/mongo.service';

@Injectable()
export class FeedStockService extends MongoService<FeedStock> {
  searchs = [];

  constructor(@InjectModel(FeedStock.name) model: Model<FeedStock>) {
    super(model);
  }

  async incrementQuantity(id: Types.ObjectId, amount: number): Promise<void> {
    await this.model.updateOne({ _id: id }, { $inc: { currentQuantity: amount } });
  }

  async decrementQuantity(
    id: Types.ObjectId,
    amount: number,
  ): Promise<FeedStock | null> {
    return this.model.findOneAndUpdate(
      { _id: id, currentQuantity: { $gte: amount } },
      { $inc: { currentQuantity: -amount } },
      { new: true },
    );
  }

  async adjustQuantity(id: Types.ObjectId, delta: number): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      [
        {
          $set: {
            currentQuantity: { $max: [0, { $add: ['$currentQuantity', delta] }] },
          },
        },
      ],
    );
  }

  async pagination(param: TypePagination): Promise<TypePaginationResult> {
    const page = param.pagination?.page ?? 1;
    const limit = param.pagination?.limit ?? 10;
    const sort = param.pagination?.sort ?? { _id: -1 };
    const search = param.search?.trim();
    const category = param.filter?.category;

    const andConditions: any[] = [];

    if (category) {
      andConditions.push({ 'feedTypeId.category': category });
    }

    if (search) {
      andConditions.push({
        $or: [
          { 'feedTypeId.feedCode': { $regex: search, $options: 'i' } },
          { 'feedTypeId.feedName': { $regex: search, $options: 'i' } },
        ],
      });
    }

    const basePipeline: any[] = [
      {
        $lookup: {
          from: 'feed_types',
          localField: 'feedTypeId',
          foreignField: '_id',
          as: 'feedTypeId',
        },
      },
      { $unwind: { path: '$feedTypeId', preserveNullAndEmptyArrays: false } },
      ...(andConditions.length ? [{ $match: { $and: andConditions } }] : []),
    ];

    const [countResult, docs] = await Promise.all([
      this.model.aggregate([...basePipeline, { $count: 'total' }]),
      this.model.aggregate([
        ...basePipeline,
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]),
    ]);

    const total = countResult[0]?.total ?? 0;

    return {
      list: docs,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    };
  }
}
