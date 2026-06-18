import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RolesGuard } from './guards/roles.guard';
import { RequestContextModule } from 'nestjs-request-context';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenusModule } from './modules/menus/menus.module';
import { PensModule } from './modules/pens/pens.module';
import { PigsModule } from './modules/pigs/pigs.module';
import { FeedTypeModule } from './modules/feed/feed-type.module';
import { FeedStockModule } from './modules/feed/feed-stock.module';
import { BuyersModule } from './modules/buyers/buyers.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DataAddressModule } from './modules/data-address/data-address.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EformModule } from './eform/eform.module';
import { MasterHouseTypeModule } from './modules/master-house-type/master-house-types.module';
import { HousesModule } from './modules/houses/houses.module';
import { PigBatchModule } from './modules/pig-batch/pig-batch.module';
import { SaleModule } from './modules/sale/sale.module';
import { TodoModule } from './modules/todo/todo.module';
import { ThaiAddressModule } from './modules/thai-address/thai-address.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestContextModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/pig-farm',
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    MenusModule,
    PensModule,
    PigsModule,
    FeedTypeModule,
    FeedStockModule,
    BuyersModule,
    DataAddressModule,
    DashboardModule,
    EformModule,
    CustomerModule,
    MasterHouseTypeModule,
    HousesModule,
    PigBatchModule,
    SaleModule,
    TodoModule,
    ThaiAddressModule,
    RouterModule.register([
      { path: 'auth', module: AuthModule },
      { path: 'users', module: UsersModule },
      { path: 'roles', module: RolesModule },
      { path: 'menus', module: MenusModule },
      { path: 'pens', module: PensModule },
      { path: 'pigs', module: PigsModule },
      { path: 'feed-types', module: FeedTypeModule },
      { path: 'feed-stocks', module: FeedStockModule },
      { path: 'buyers', module: BuyersModule },
      { path: 'data-addresses', module: DataAddressModule },
      { path: 'dashboard', module: DashboardModule },
      { path: 'customers', module: CustomerModule },
      { path: 'master-house-types', module: MasterHouseTypeModule },
      { path: 'houses', module: HousesModule },
      { path: 'pig-batches', module: PigBatchModule },
      { path: 'sales', module: SaleModule },
      { path: 'todos', module: TodoModule },
      { path: 'thai-addresses', module: ThaiAddressModule },
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
        { path: 'docs', method: RequestMethod.ALL },
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'thai-addresses', method: RequestMethod.GET },
        { path: 'thai-addresses/districts', method: RequestMethod.GET },
        { path: 'thai-addresses/sub-districts', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
