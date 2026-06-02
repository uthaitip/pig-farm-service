import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/schemas/user.schema';
import { PaginationDto } from 'src/dtos/pagination.dto';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '../dtos/user.dto';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private service: UsersService) {}

  async _beforeCreate(body: CreateUserDto) {
    const byEmail = await this.service.findOne({ email: body.email });
    if (byEmail) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
  }

  async _beforeUpdate(item: User, body: UpdateUserDto) {
    if (body.email) {
      const byEmail = await this.service.findOne({ email: body.email });
      if (byEmail && byEmail._id.toString() !== item._id.toString()) {
        throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
      }
    }
  }

  @Get()
  async find(@Res() res: Response, @Query() query: PaginationDto) {
    const filter = query.filter || {};
    const result = await this.service.pagination({
      pagination: query.toPagination(),
      filter: filter,
      search: query.search,
      selects: ['-password'],
    });
    return MyResponse.sendOk(res, result);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    return MyResponse.sendOk(res, item);
  }

  @Post()
  async create(@Res() res: Response, @Body() body: CreateUserDto) {
    await this._beforeCreate(body);
    const result = await this.service.create(body);
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: UpdateUserDto,
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    await this._beforeUpdate(item, body);
    const update = await this.service.setById(item._id, body);
    return MyResponse.sendOk(res, update);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: { status: string },
  ) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    const update = await this.service.setById(item._id, {
      status: body.status,
    });
    return MyResponse.sendOk(res, update);
  }

  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: ChangePasswordDto,
  ) {
    const currentUserId = res.locals.user?.id;
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    if (item._id.toString() !== currentUserId) {
      throw new ForbiddenException('ไม่มีสิทธิ์เปลี่ยนรหัสผ่านของผู้ใช้อื่น');
    }
    const result = await this.service.changePassword(item._id.toString(), body);
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const item = await this.service.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    const deleted = await this.service.deleteById(item._id);
    return MyResponse.sendOk(res, deleted);
  }
}
