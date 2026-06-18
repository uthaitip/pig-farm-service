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
import { FeedType, FeedTypeSchema } from './schemas/feed-type.schema';
import { FeedStock, FeedStockSchema } from './schemas/feed-stock.schema';
import { FeedStockTransaction, FeedStockTransactionSchema } from './schemas/feed-stock-transaction.schema';
import { FeedReceive, FeedReceiveSchema } from './schemas/feed-receive.schema';
import {
  FeedDispense,
  FeedDispenseSchema,
} from './schemas/feed-dispense.schema';
import { Buyer, BuyerSchema } from './schemas/buyer.schema';
import { OtpSession, OtpSessionSchema } from './schemas/otp-session.schema';
import { DataAddress, DataAddressSchema } from './schemas/data-address.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import {
  MasterHouseType,
  MasterHouseTypeSchema,
} from './schemas/master-house-type';
import { House, HouseSchema } from './schemas/house.schema';
import { PigBatch, PigBatchSchema } from './schemas/pig-batch.schema';
import { PigBatchTransaction, PigBatchTransactionSchema } from './schemas/pig-batch-transaction.schema';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { SaleDetail, SaleDetailSchema } from './schemas/sale-detail.schema';
import { ExpenseCategory, ExpenseCategorySchema } from './schemas/expense-category.schema';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { ThaiProvince, ThaiProvinceSchema } from './schemas/thai-province.schema';
import { ThaiDistrict, ThaiDistrictSchema } from './schemas/thai-district.schema';
import { ThaiSubDistrict, ThaiSubDistrictSchema } from './schemas/thai-sub-district.schema';

export const DBModels = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  MongooseModule.forFeature([{ name: Pen.name, schema: PenSchema }]),
  MongooseModule.forFeature([
    { name: PigReceive.name, schema: PigReceiveSchema },
  ]),
  MongooseModule.forFeature([{ name: PigSale.name, schema: PigSaleSchema }]),
  MongooseModule.forFeature([
    { name: PigTransfer.name, schema: PigTransferSchema },
  ]),
  MongooseModule.forFeature([
    { name: PigWeight.name, schema: PigWeightSchema },
  ]),
  MongooseModule.forFeature([
    { name: PigHealth.name, schema: PigHealthSchema },
  ]),
  MongooseModule.forFeature([{ name: FeedType.name, schema: FeedTypeSchema }]),
  MongooseModule.forFeature([{ name: FeedStock.name, schema: FeedStockSchema }]),
  MongooseModule.forFeature([{ name: FeedStockTransaction.name, schema: FeedStockTransactionSchema }]),
  MongooseModule.forFeature([{ name: FeedReceive.name, schema: FeedReceiveSchema }]),
  MongooseModule.forFeature([{ name: FeedDispense.name, schema: FeedDispenseSchema }]),
  MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
  MongooseModule.forFeature([
    { name: OtpSession.name, schema: OtpSessionSchema },
  ]),
  MongooseModule.forFeature([
    { name: DataAddress.name, schema: DataAddressSchema },
  ]),
  MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  MongooseModule.forFeature([
    { name: MasterHouseType.name, schema: MasterHouseTypeSchema },
  ]),
  MongooseModule.forFeature([{ name: House.name, schema: HouseSchema }]),
  MongooseModule.forFeature([{ name: PigBatch.name, schema: PigBatchSchema }]),
  MongooseModule.forFeature([{ name: PigBatchTransaction.name, schema: PigBatchTransactionSchema }]),
  MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
  MongooseModule.forFeature([{ name: SaleDetail.name, schema: SaleDetailSchema }]),
  MongooseModule.forFeature([{ name: ExpenseCategory.name, schema: ExpenseCategorySchema }]),
  MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
  MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  MongooseModule.forFeature([{ name: ThaiProvince.name, schema: ThaiProvinceSchema }]),
  MongooseModule.forFeature([{ name: ThaiDistrict.name, schema: ThaiDistrictSchema }]),
  MongooseModule.forFeature([{ name: ThaiSubDistrict.name, schema: ThaiSubDistrictSchema }]),
];
