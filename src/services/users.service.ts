import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { MongoService } from './mongo/mongo.service';
import { DataAddressService } from './data-address.service';
import MyRandom from 'src/libraries/my-random';
import {
  CreateUserDto,
  ChangePasswordDto,
} from 'src/modules/users/dtos/user.dto';

@Injectable()
export class UsersService extends MongoService<User> {
  searchs = ['fullName', 'email', 'phone'];

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    private readonly addressService: DataAddressService,
  ) {
    super(userModel);
  }

  async create(dto: CreateUserDto) {
    const exists = await this.findOne({ email: dto.email });
    if (exists) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    const hashed = await bcrypt.hash(dto.password, 10);
    const customerCode = await this.generateCustomerCode();
    const { address, ...userFields } = dto;
    const user = await this.insert({
      ...userFields,
      customerCode,
      password: hashed,
      status: 'active',
    });
    if (address) {
      await this.addressService.insert({
        ...(address as Record<string, unknown>),
        customerCode,
        isDefault: 1,
        isActive: 1,
      });
    }
    return user;
  }

  private async generateCustomerCode(): Promise<string> {
    let code: string;
    let exists: boolean;
    do {
      code = 'CUS' + MyRandom.numberOnly(6);
      exists = !!(await this.findOne({ customerCode: code }));
    } while (exists);
    return code;
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    const match = await bcrypt.compare(dto.oldPassword, doc.password);
    if (!match) throw new UnauthorizedException('รหัสผ่านเดิมไม่ถูกต้อง');
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.setById(id, { password: hashed });
  }
}
