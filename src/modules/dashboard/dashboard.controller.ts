import { Controller, Get, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Model } from 'mongoose';
import MyResponse from 'src/libraries/my-response';
import { Pen } from 'src/schemas/pen.schema';
import { FeedStock } from 'src/schemas/feed-stock.schema';
import { FeedDispense } from 'src/schemas/feed-dispense.schema';
import { PigReceive } from 'src/schemas/pig-receive.schema';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(
    @InjectModel(Pen.name)         private penModel:         Model<Pen>,
    @InjectModel(FeedStock.name)   private feedStockModel:   Model<FeedStock>,
    @InjectModel(FeedDispense.name) private feedDispenseModel: Model<FeedDispense>,
    @InjectModel(PigReceive.name)  private pigReceiveModel:  Model<PigReceive>,
  ) {}

  @Get()
  async get(@Res() res: Response) {
    const [pens, feedStocks, recentDispenses, recentReceives] = await Promise.all([
      this.penModel.find({}).lean(),
      this.feedStockModel.find({ status: 'active' }).sort({ name: 1 }).lean(),
      this.feedDispenseModel.find({}).sort({ date: -1 }).limit(5).lean(),
      this.pigReceiveModel.find({}).sort({ date: -1 }).limit(5).lean(),
    ]);

    const totalPigs    = pens.reduce((sum, p) => sum + (p.currentCount || 0), 0);
    const activePens   = pens.filter((p) => (p.currentCount || 0) > 0).length;
    const totalPens    = pens.length;
    const feedLowCount = feedStocks.filter((s) => s.quantity <= s.minQuantity).length;

    return MyResponse.sendOk(res, {
      totalPigs,
      activePens,
      totalPens,
      feedLowCount,
      feedStocks: feedStocks.map((s) => ({
        feedType:   s.name,
        currentQty: s.quantity,
        minQty:     s.minQuantity,
        unit:       s.unit,
      })),
      recentDispenses: recentDispenses.map((d) => ({
        penName:      d.penName,
        feedTypeName: d.feedName,
        quantity:     d.quantity,
        unit:         'กก.',
        date:         d.date,
      })),
      recentReceives: recentReceives.map((r) => ({
        penName:  r.penName,
        quantity: r.quantity,
        source:   r.source,
        date:     r.date,
      })),
    });
  }
}
