import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { Pen, PenSchema } from './schemas/pen.schema';
import { PigReceive, PigReceiveSchema } from './schemas/pig-receive.schema';
import { PigSale, PigSaleSchema } from './schemas/pig-sale.schema';
import { PigTransfer, PigTransferSchema } from './schemas/pig-transfer.schema';
import { PigWeight, PigWeightSchema } from './schemas/pig-weight.schema';
import { PigHealth, PigHealthSchema } from './schemas/pig-health.schema';
import { FeedStock, FeedStockSchema } from './schemas/feed-stock.schema';
import { FeedReceive, FeedReceiveSchema } from './schemas/feed-receive.schema';
import { FeedDispense, FeedDispenseSchema } from './schemas/feed-dispense.schema';
import { Buyer, BuyerSchema } from './schemas/buyer.schema';
import { OtpSession, OtpSessionSchema } from './schemas/otp-session.schema';
import { DataAddress, DataAddressSchema } from './schemas/data-address.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';

export const DBModels = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  MongooseModule.forFeature([{ name: Pen.name, schema: PenSchema }]),
  MongooseModule.forFeature([{ name: PigReceive.name, schema: PigReceiveSchema }]),
  MongooseModule.forFeature([{ name: PigSale.name, schema: PigSaleSchema }]),
  MongooseModule.forFeature([{ name: PigTransfer.name, schema: PigTransferSchema }]),
  MongooseModule.forFeature([{ name: PigWeight.name, schema: PigWeightSchema }]),
  MongooseModule.forFeature([{ name: PigHealth.name, schema: PigHealthSchema }]),
  MongooseModule.forFeature([{ name: FeedStock.name, schema: FeedStockSchema }]),
  MongooseModule.forFeature([{ name: FeedReceive.name, schema: FeedReceiveSchema }]),
  MongooseModule.forFeature([{ name: FeedDispense.name, schema: FeedDispenseSchema }]),
  MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
  MongooseModule.forFeature([{ name: OtpSession.name, schema: OtpSessionSchema }]),
  MongooseModule.forFeature([{ name: DataAddress.name, schema: DataAddressSchema }]),
  MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
];
