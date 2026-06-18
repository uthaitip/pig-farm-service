import { Controller, Get, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Model } from 'mongoose';
import MyResponse from 'src/libraries/my-response';
import { PigBatch } from 'src/schemas/pig-batch.schema';
import { FeedStock } from 'src/schemas/feed-stock.schema';
import { FeedStockTransaction } from 'src/schemas/feed-stock-transaction.schema';
import { Sale } from 'src/schemas/sale.schema';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(
    @InjectModel(PigBatch.name)            private pigBatchModel:  Model<PigBatch>,
    @InjectModel(FeedStock.name)           private feedStockModel: Model<FeedStock>,
    @InjectModel(FeedStockTransaction.name) private feedTxModel:   Model<FeedStockTransaction>,
    @InjectModel(Sale.name)                private saleModel:      Model<Sale>,
  ) {}

  @Get()
  async get(@Res() res: Response) {
    const thisMonth = new Date().toISOString().slice(0, 7); // "2026-06"

    const [batches, feedStocks, saleIncome, feedInTotal] = await Promise.all([
      this.pigBatchModel.find({}).lean(),
      this.feedStockModel.find({}).populate('feedTypeId', 'feedCode feedName unit category').lean(),
      this.saleModel.aggregate([
        { $match: { status: 'COMPLETED', saleDate: { $regex: `^${thisMonth}` } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      this.feedTxModel.aggregate([
        { $match: { transactionType: 'IN', transactionDate: { $regex: `^${thisMonth}` }, totalAmount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalPigCount    = batches.reduce((s, b) => s + (b.currentQuantity || 0), 0);
    const activeBatchCount = batches.filter((b) => b.status === 'ACTIVE').length;
    const totalBatchCount  = batches.length;
    const incomeThisMonth  = saleIncome[0]?.total ?? 0;
    const expenseThisMonth = feedInTotal[0]?.total ?? 0;
    const profitThisMonth  = incomeThisMonth - expenseThisMonth;

    return MyResponse.sendOk(res, {
      totalPigCount,
      activeBatchCount,
      totalBatchCount,
      incomeThisMonth,
      expenseThisMonth,
      profitThisMonth,
      feedStocks: (feedStocks as any[]).map((s) => ({
        feedCode:   s.feedTypeId?.feedCode,
        feedName:   s.feedTypeId?.feedName,
        category:   s.feedTypeId?.category,
        currentQty: s.currentQuantity,
        unit:       s.feedTypeId?.unit,
      })),
    });
  }
}
