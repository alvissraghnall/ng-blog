import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { JwtKeyService } from './jwt/jwt-key.service';
import { User } from '../users/entities/user.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from '../users/dto/create-user.input';
import { OAuthProfile } from './interfaces/oauth-profile.interface';
import { JwtPayload } from './jwt/jwt.payload';

const mockUsersService = {
  findOneByUsername: jest.fn(),
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  findByProviderId: jest.fn(),
  linkOAuthProvider: jest.fn(),
  createOAuthUser: jest.fn(),
  getByPayload: jest.fn(),
};

const mockHashService = {
  comparePassword: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockJwtKeyService = {
  getPrivKey: jest.fn(),
};

const mockUser: User = {
  id: 'user-id-1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  isOAuthUser: jest.fn(),
  canUsePasswordAuth: jest.fn(),
} as any;

const mockOAuthUser: User = {
  id: 'user-id-2',
  username: 'oauthuser',
  email: 'oauth@example.com',
  password: null,
  isOAuthUser: jest.fn(),
  canUsePasswordAuth: jest.fn(),
} as any;

const mockCreateUserInput: CreateUserInput = {
  username: 'newuser',
  email: 'new@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

const mockProfile: OAuthProfile = {
  id: 'oauth-123',
  provider: 'google',
  email: 'oauth@example.com',
  name: 'OAuth User',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<typeof mockUsersService>;
  let hashService: jest.Mocked<typeof mockHashService>;
  let jwtService: jest.Mocked<typeof mockJwtService>;
  let jwtKeyService: jest.Mocked<typeof mockJwtKeyService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: HashService, useValue: mockHashService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: JwtKeyService, useValue: mockJwtKeyService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    hashService = module.get(HashService);
    jwtService = module.get(JwtService);
    jwtKeyService = module.get(JwtKeyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token and user', async () => {
      const privateKey = 'mock-private-key';
      const token = 'mock-jwt-token';
      (mockUser.isOAuthUser as jest.Mock).mockReturnValue(false);
      jwtKeyService.getPrivKey.mockResolvedValue(privateKey as any);
      jwtService.sign.mockReturnValue(token);

      const result = await service.login(mockUser);

      const expectedPayload = {
        username: mockUser.username,
        sub: mockUser.id,
        email: mockUser.email,
        isOAuth: false,
      };

      expect(jwtKeyService.getPrivKey).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload, {
        algorithm: 'RS256',
        privateKey: privateKey,
      });
      expect(result).toEqual({
        access_token: token,
        user: mockUser,
      });
    });
  });

  describe('validatePasswordUser', () => {
    it('should throw NotFoundException if user not found', async () => {
      usersService.findOneByUsername.mockResolvedValue(null);
      await expect(
        service.validatePasswordUser('notfound', 'pass'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException for OAuth user without password auth', async () => {
      (mockOAuthUser.isOAuthUser as jest.Mock).mockReturnValue(true);
      (mockOAuthUser.canUsePasswordAuth as jest.Mock).mockReturnValue(false);
      usersService.findOneByUsername.mockResolvedValue(mockOAuthUser);

      await expect(
        service.validatePasswordUser(mockOAuthUser.username, 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException for invalid password', async () => {
      (mockUser.isOAuthUser as jest.Mock).mockReturnValue(false);
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      hashService.comparePassword.mockResolvedValue(false);

      await expect(
        service.validatePasswordUser(mockUser.username, 'wrongpass'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return user on successful validation', async () => {
      (mockUser.isOAuthUser as jest.Mock).mockReturnValue(false);
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      hashService.comparePassword.mockResolvedValue(true);

      const result = await service.validatePasswordUser(
        mockUser.username,
        'correctpass',
      );

      expect(result).toEqual(mockUser);
      expect(hashService.comparePassword).toHaveBeenCalledWith(
        'correctpass',
        mockUser.password,
      );
    });
  });

  describe('createPasswordUser', () => {
    it('should throw ConflictException if username exists', async () => {
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      await expect(
        service.createPasswordUser(mockCreateUserInput),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email exists', async () => {
      usersService.findOneByUsername.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      await expect(
        service.createPasswordUser(mockCreateUserInput),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and return a new user', async () => {
      const newUser = {
        ...mockCreateUserInput,
        id: 'new-id',
      } as unknown as User;
      usersService.findOneByUsername.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(newUser);

      const result = await service.createPasswordUser(mockCreateUserInput);

      expect(usersService.create).toHaveBeenCalledWith(mockCreateUserInput);
      expect(result).toEqual(newUser);
    });
  });

  describe('validateOAuthLogin', () => {
    it('should return user if found by provider ID', async () => {
      usersService.findByProviderId.mockResolvedValue(mockOAuthUser);
      const result = await service.validateOAuthLogin(mockProfile);

      expect(result).toEqual(mockOAuthUser);
      expect(usersService.findByProviderId).toHaveBeenCalledWith(
        mockProfile.id,
        mockProfile.provider,
      );
      expect(usersService.findOneByEmail).not.toHaveBeenCalled();
    });

    it('should link existing password user if found by email', async () => {
      const linkedUser = { ...mockUser, oauthId: mockProfile.id };
      (mockUser.isOAuthUser as jest.Mock).mockReturnValue(false);
      usersService.findByProviderId.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      usersService.linkOAuthProvider.mockResolvedValue(linkedUser);

      const result = await service.validateOAuthLogin(mockProfile);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        mockProfile.email,
      );
      expect(usersService.linkOAuthProvider).toHaveBeenCalledWith(
        mockUser.id,
        mockProfile.provider,
        mockProfile.id,
      );
      expect(result).toEqual(linkedUser);
    });

    it('should return existing OAuth user if found by email (no link)', async () => {
      (mockOAuthUser.isOAuthUser as jest.Mock).mockReturnValue(true);
      usersService.findByProviderId.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(mockOAuthUser);

      const result = await service.validateOAuthLogin(mockProfile);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        mockProfile.email,
      );
      expect(usersService.linkOAuthProvider).not.toHaveBeenCalled();
      expect(result).toEqual(mockOAuthUser);
    });

    it('should create a new OAuth user if no user found', async () => {
      usersService.findByProviderId.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.createOAuthUser.mockResolvedValue(mockOAuthUser);

      const result = await service.validateOAuthLogin(mockProfile);

      expect(usersService.createOAuthUser).toHaveBeenCalledWith(mockProfile);
      expect(result).toEqual(mockOAuthUser);
    });

    it('should throw BadRequestException on service error', async () => {
      const error = new Error('Database error');
      usersService.findByProviderId.mockRejectedValue(error);

      await expect(service.validateOAuthLogin(mockProfile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateUserByPayload', () => {
    it('should return user from payload', async () => {
      const payload: JwtPayload = { sub: 'user-id-1' } as any;
      usersService.getByPayload.mockResolvedValue(mockUser);

      const result = await service.validateUserByPayload(payload);

      expect(usersService.getByPayload).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockUser);
    });
  });
});
