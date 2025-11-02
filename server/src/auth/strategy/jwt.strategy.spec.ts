import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { JwtKeyService } from '../jwt/jwt-key.service';
import { JwtPayload } from '../jwt/jwt.payload';
import { User } from 'users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  validateUserByPayload: jest.fn(),
};

const mockJwtKeyService = {
  getPubKey: jest.fn(),
};

const mockUser = {
  id: 'user-id',
  username: 'testuser',
} as User;

const mockPayload: JwtPayload = {
  sub: 'user-id',
  username: 'testuser',
  email: 'stub@email.io',
  isOAuth: false,
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: typeof mockAuthService;
  let jwtKeyService: typeof mockJwtKeyService;

  beforeEach(async () => {
    mockJwtKeyService.getPubKey.mockResolvedValue('mock-public-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtKeyService,
          useValue: mockJwtKeyService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get(AuthService);
    jwtKeyService = module.get(JwtKeyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      authService.validateUserByPayload.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockPayload);

      expect(authService.validateUserByPayload).toHaveBeenCalledWith(
        mockPayload,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      authService.validateUserByPayload.mockResolvedValue(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException if authService throws', async () => {
      authService.validateUserByPayload.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(mockPayload)).rejects.toThrow('DB error');
    });
  });
});
