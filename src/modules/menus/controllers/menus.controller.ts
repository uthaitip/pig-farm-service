import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { MenusService } from 'src/services/menus.service';
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto';

@ApiTags('menus')
@Controller()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.menusService.find({}, { sort: { sort: 1, name: 1 } });
    return MyResponse.sendOk(res, result);
  }

  @Post()
  async create(@Body() dto: CreateMenuDto, @Res() res: Response) {
    const result = await this.menusService.insert({ ...dto, status: 'active' });
    return MyResponse.sendOk(res, result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
    @Res() res: Response,
  ) {
    const item = await this.menusService.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลเมนู');
    const result = await this.menusService.setById(item._id, { ...dto });
    return MyResponse.sendOk(res, result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const item = await this.menusService.findByIdentity(id);
    if (!item) throw new NotFoundException('ไม่พบข้อมูลเมนู');
    const result = await this.menusService.deleteById(item._id);
    return MyResponse.sendOk(res, result);
  }
}
