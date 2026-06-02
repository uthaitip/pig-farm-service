import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer } from 'src/schemas/buyer.schema';
import { MongoService } from './mongo/mongo.service';
import MyRandom from 'src/libraries/my-random';
import { CreateBuyerDto } from 'src/modules/buyers/dtos/buyer.dto';
import { DataAddressService } from './data-address.service';

@Injectable()
export class BuyersService extends MongoService<Buyer> {
  searchs = ['name', 'phone'];

  constructor(
    @InjectModel(Buyer.name) buyerModel: Model<Buyer>,
    private readonly addressService: DataAddressService,
  ) {
    super(buyerModel);
  }

  private async generateBuyerCode(): Promise<string> {
    let code: string;
    let exists: boolean;

    do {
      code = 'BUYS' + MyRandom.numberOnly(6);
      exists = !!(await this.findOne({ customerCode: code }));
    } while (exists);
    return code;
  }

  async create(dto: CreateBuyerDto) {
    if (dto.phone) {
      const exists = await this.findOne({ phone: dto.phone });
      if (exists) throw new ConflictException('เบอร์นี้ลงทะเบียนแล้ว');
    }
    const buyerCode = await this.generateBuyerCode();
    const { address, ...userFields } = dto;
    const buyer = await this.insert({
      ...userFields,
      customerCode: buyerCode,
    });

    if (address) {
      await this.addressService.insert({
        ...(address as Record<string, unknown>),
        customerCode: buyerCode,
        isDefault: 1,
        isActive: 1,
      });
    }

    return buyer;
  }
}
