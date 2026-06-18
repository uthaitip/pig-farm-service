import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/user.schema';
import { Role } from 'src/schemas/role.schema';
import { Menu } from 'src/schemas/menu.schema';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash:    jest.fn().mockResolvedValue('hashed-password'),
}));

const mockUser = {
  _id: 'user-id-001',
  email: 'test@example.com',
  password: 'hashed-password',
  fullName: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  roleId: 'role-id-001',
  status: 'active',
  phone: '0812345678',
  toObject: function () { return { ...this, toObject: undefined }; },
};

const mockRole = { _id: 'role-id-001', code: 'admin' };

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create:   jest.fn(),
};

const mockRoleModel = {
  findById: jest.fn(),
};

const mockMenuModel = {};

const mockJwtService = {
  sign:   jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Role.name), useValue: mockRoleModel },
        { provide: getModelToken(Menu.name), useValue: mockMenuModel },
        { provide: JwtService,              useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('คืน token + refreshToken + profile เมื่อ credentials ถูกต้อง', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockRoleModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockRole),
      });
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.login({ email: 'test@example.com', password: 'password' });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('profile');
      expect(result.profile.email).toBe('test@example.com');
    });

    it('throw UnauthorizedException เมื่อไม่พบ email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login({ email: 'no@example.com', password: 'x' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException เมื่อ password ผิด', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException เมื่อ status ไม่ใช่ active', async () => {
      mockUserModel.findOne.mockResolvedValue({ ...mockUser, status: 'inactive' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login({ email: 'test@example.com', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── getProfile ───────────────────────────────────────────────────────────

  describe('getProfile()', () => {
    it('คืน user object พร้อม populate roleId', async () => {
      const populateMock = jest.fn().mockResolvedValue(mockUser);
      const selectMock   = jest.fn().mockReturnValue({ populate: populateMock });
      mockUserModel.findById.mockReturnValue({ select: selectMock });

      const result = await service.getProfile('user-id-001');

      expect(mockUserModel.findById).toHaveBeenCalledWith('user-id-001');
      expect(result.email).toBe('test@example.com');
    });

    it('throw UnauthorizedException เมื่อไม่พบ user', async () => {
      const populateMock = jest.fn().mockResolvedValue(null);
      const selectMock   = jest.fn().mockReturnValue({ populate: populateMock });
      mockUserModel.findById.mockReturnValue({ select: selectMock });

      await expect(service.getProfile('not-exist'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── refresh ──────────────────────────────────────────────────────────────

  describe('refresh()', () => {
    it('คืน token ใหม่เมื่อ refresh token ถูกต้อง', async () => {
      mockJwtService.verify.mockReturnValue({ id: 'user-id-001', type: 'refresh' });
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockRoleModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockRole),
      });
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('token');
    });

    it('throw UnauthorizedException เมื่อ refresh token payload ไม่ใช่ type refresh', async () => {
      mockJwtService.verify.mockReturnValue({ id: 'user-id-001', type: 'access' });

      await expect(service.refresh('bad-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException เมื่อ token expired (verify throw)', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('expired'); });

      await expect(service.refresh('expired-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException เมื่อ user ถูก suspend', async () => {
      mockJwtService.verify.mockReturnValue({ id: 'user-id-001', type: 'refresh' });
      mockUserModel.findById.mockResolvedValue({ ...mockUser, status: 'inactive' });

      await expect(service.refresh('valid-refresh-token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register()', () => {
    it('สร้าง user ใหม่และคืน _id, fullName, email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        _id: 'new-user-id',
        fullName: 'New User',
        email: 'new@example.com',
      });

      const result = await service.register({
        fullName: 'New User',
        email:    'new@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('_id');
      expect(result.email).toBe('new@example.com');
    });

    it('throw ConflictException เมื่อ email ซ้ำ', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register({
        fullName: 'Dup',
        email:    'test@example.com',
        password: 'password123',
      })).rejects.toThrow(ConflictException);
    });
  });
});
