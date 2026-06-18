import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { Role } from 'src/schemas/role.schema';
import { Menu } from 'src/schemas/menu.schema';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtPayload } from 'src/libraries/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    if (user.status !== 'active') throw new UnauthorizedException('บัญชีถูกระงับการใช้งาน');

    const role = await this.roleModel.findById(user.roleId).select('code');
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId?.toString() ?? '',
      roleCode: role?.code ?? '',
    };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { id: user._id.toString(), type: 'refresh' },
      {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET,
      },
    );
    return { token, refreshToken, profile: this.toProfile(user) };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET,
      });
      if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid refresh token');
      const user = await this.userModel.findById(payload.id);
      if (!user || user.status !== 'active') throw new UnauthorizedException('ไม่พบผู้ใช้หรือบัญชีถูกระงับ');
      const role = await this.roleModel.findById(user.roleId).select('code');
      const newToken = this.jwtService.sign({
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId?.toString() ?? '',
        roleCode: role?.code ?? '',
      } as JwtPayload);
      return { token: newToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
      phone: dto.phone || undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    return { _id: user._id, fullName: user.fullName, email: user.email };
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('_id userCode firstName lastName fullName email phone birthDate startDate roleId status')
      .populate({ path: 'roleId', populate: { path: 'menuIds' } });
    if (!user) throw new UnauthorizedException('ไม่พบผู้ใช้');
    return user.toObject();
  }

  private toProfile(user: any) {
    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      status: user.status,
    };
  }
}
