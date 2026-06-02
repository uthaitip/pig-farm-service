import { Controller, Get, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Response } from 'express';
import { FeedStock } from 'src/schemas/feed-stock.schema';
import { PdfService } from 'src/eform/services/pdf.service';
import MyResponse from 'src/libraries/my-response';
import * as path from 'path';

@ApiTags('eform')
@Controller('feed-stocks')
export class FeedStockReportController {
  constructor(
    @InjectModel(FeedStock.name) private readonly stockModel: Model<FeedStock>,
  ) {}

  @Get()
  async report(@Res() res: Response) {
    const stocks = await this.stockModel.find({}).sort({ name: 1 }).lean();
    const lowStockCount = stocks.filter((s) => s.quantity <= s.minQuantity).length;
    const buffer = await PdfService.generate(
      path.join(process.cwd(), 'ejs/feed-stock-report.ejs'),
      {
        stocks,
        lowStockCount,
        generatedAt: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    );
    MyResponse.sendPdf(res, buffer, { name: 'feed-stock-report.pdf' });
  }
}
