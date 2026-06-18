import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import MyResponse from 'src/libraries/my-response';
import { ThaiProvince } from 'src/schemas/thai-province.schema';
import { ThaiDistrict } from 'src/schemas/thai-district.schema';
import { ThaiSubDistrict } from 'src/schemas/thai-sub-district.schema';

@ApiTags('thai-addresses')
@Controller()
export class ThaiAddressController {
  constructor(
    @InjectModel(ThaiProvince.name)
    private readonly provinceModel: Model<ThaiProvince>,
    @InjectModel(ThaiDistrict.name)
    private readonly districtModel: Model<ThaiDistrict>,
    @InjectModel(ThaiSubDistrict.name)
    private readonly subDistrictModel: Model<ThaiSubDistrict>,
  ) {}

  @Get()
  async getProvinces(@Res() res: Response) {
    const result = await this.provinceModel
      .find({}, { _id: 0, __v: 0 })
      .sort({ id: 1 })
      .lean();
    return MyResponse.sendOk(res, result);
  }

  @Get('districts')
  async getDistricts(
    @Query('provinceId') provinceId: string,
    @Res() res: Response,
  ) {
    const result = await this.districtModel
      .find({ province_id: Number(provinceId) }, { _id: 0, __v: 0 })
      .sort({ id: 1 })
      .lean();
    return MyResponse.sendOk(res, result);
  }

  @Get('sub-districts')
  async getSubDistricts(
    @Query('districtId') districtId: string,
    @Res() res: Response,
  ) {
    const result = await this.subDistrictModel
      .find({ district_id: Number(districtId) }, { _id: 0, __v: 0 })
      .sort({ id: 1 })
      .lean();
    return MyResponse.sendOk(res, result);
  }

  @Get('search')
  async search(@Query('q') q: string, @Res() res: Response) {
    if (!q || q.trim().length < 2) return MyResponse.sendOk(res, []);

    const subDistricts = await this.subDistrictModel
      .find({ name_th: { $regex: q.trim(), $options: 'i' } }, { _id: 0, __v: 0 })
      .limit(30)
      .lean();

    const districtIds  = [...new Set(subDistricts.map((s: any) => s.district_id))];
    const districts    = await this.districtModel.find({ id: { $in: districtIds } }, { _id: 0, __v: 0 }).lean();
    const provinceIds  = [...new Set(districts.map((d: any) => d.province_id))];
    const provinces    = await this.provinceModel.find({ id: { $in: provinceIds } }, { _id: 0, __v: 0 }).lean();

    const districtMap  = Object.fromEntries(districts.map((d: any)  => [d.id,  d]));
    const provinceMap  = Object.fromEntries(provinces.map((p: any)  => [p.id,  p]));

    const result = subDistricts.map((s: any) => {
      const district = districtMap[s.district_id] ?? {};
      const province = provinceMap[district.province_id] ?? {};
      return {
        subDistrictId:   s.id,
        subDistrictName: s.name_th,
        zipCode:         s.zip_code,
        districtId:      district.id,
        districtName:    district.name_th,
        provinceId:      province.id,
        provinceName:    province.name_th,
      };
    });

    return MyResponse.sendOk(res, result);
  }
}
