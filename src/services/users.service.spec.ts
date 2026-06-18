import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { DataAddressService } from './data-address.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash:    jest.fn().mockResolvedValue('hashed-password'),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeUserDoc = (overrides: Partial<any> = {}) => ({
  _id: new Types.ObjectId('64a1b2c3d4e5f6a7b8c9d001'),
  userCode: 'U00001',
  customerCode: 'CUS123456',
  email: 'user@example.com',
  password: '$2b$10$hashedpassword',
  firstName: 'สมชาย',
  lastName:  'ใจดี',
  fullName:  'สมชาย ใจดี',
  phone:     '0812345678',
  roleId:    new Types.ObjectId('64a1b2c3d4e5f6a7b8c9d002'),
  status:    'active',
  toObject:  function () { return { ...this, toObject: undefined }; },
  ...overrides,
});

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUserModel = {
  findOne:           jest.fn(),
  findById:          jest.fn(),
  create:            jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne:         jest.fn(),
  countDocuments:    jest.fn().mockResolvedValue(0),
};

const mockAddressService = {
  insert: jest.fn().mockResolvedValue({}),
};

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: DataAddressService,       useValue: mockAddressService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ─── create() ────────────────────────────────────────────────────────────

  describe('create()', () => {
    const dto = {
      firstName: 'สมชาย',
      lastName:  'ใจดี',
      email:     'new@example.com',
      password:  'password123',
      phone:     '0812345678',
    };

    it('สร้าง user ใหม่สำเร็จเมื่อไม่มี email ซ้ำ', async () => {
      // findOne ใน MongoService คืน null (ไม่มี email ซ้ำ)
      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });
      mockUserModel.countDocuments.mockResolvedValue(0);

      const newDoc = makeUserDoc({ email: dto.email });
      jest.spyOn(service, 'insert').mockResolvedValue(newDoc as any);

      const result = await service.create(dto);

      expect(result).toHaveProperty('email', dto.email);
    });

    it('throw ConflictException เมื่อ email ซ้ำ', async () => {
      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(makeUserDoc()),
        }),
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('สร้าง address ด้วยเมื่อมี address ส่งมา', async () => {
      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });
      mockUserModel.countDocuments.mockResolvedValue(0);

      jest.spyOn(service, 'insert').mockResolvedValue(makeUserDoc({ email: dto.email }) as any);

      await service.create({ ...dto, address: { fullAddress: '123 หมู่ 1' } });

      expect(mockAddressService.insert).toHaveBeenCalledTimes(1);
    });

    it('ไม่สร้าง address เมื่อไม่มี address field', async () => {
      mockUserModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });
      mockUserModel.countDocuments.mockResolvedValue(0);

      jest.spyOn(service, 'insert').mockResolvedValue(makeUserDoc({ email: dto.email }) as any);

      await service.create(dto);

      expect(mockAddressService.insert).not.toHaveBeenCalled();
    });
  });

  // ─── changePassword() ────────────────────────────────────────────────────

  describe('changePassword()', () => {
    const userId = '64a1b2c3d4e5f6a7b8c9d001';
    const dto    = { oldPassword: 'oldPass123', password: 'newPass456' };

    it('เปลี่ยนรหัสผ่านสำเร็จเมื่อ oldPassword ถูกต้อง', async () => {
      const doc = makeUserDoc({ password: 'hashed-old' });
      mockUserModel.findById.mockResolvedValue(doc);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserModel.findByIdAndUpdate.mockResolvedValue({ ...doc, password: 'hashed-new' });

      await service.changePassword(userId, dto);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('throw NotFoundException เมื่อไม่พบ user', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.changePassword(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('throw UnauthorizedException เมื่อ oldPassword ผิด', async () => {
      const doc = makeUserDoc({ password: 'hashed-old' });
      mockUserModel.findById.mockResolvedValue(doc);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(userId, dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── searchs / defaultPopulates config ───────────────────────────────────

  describe('service config', () => {
    it('มี searchs fields ครบ', () => {
      expect(service.searchs).toEqual(
        expect.arrayContaining(['fullName', 'firstName', 'lastName', 'email', 'phone', 'userCode']),
      );
    });

    it('มี defaultPopulates สำหรับ roleId', () => {
      expect(service.defaultPopulates).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: 'roleId' })]),
      );
    });
  });
});
