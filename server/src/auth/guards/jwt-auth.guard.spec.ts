import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import {
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { User } from 'users/entities/user.entity';
import { IS_PUBLIC_KEY } from 'common/public.decorator';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  TokenExpiredError: jest.requireActual('jsonwebtoken').TokenExpiredError,
  JsonWebTokenError: jest.requireActual('jsonwebtoken').JsonWebTokenError,
}));

const mockJwtKeyService = {
  getPubKey: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
};

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

const mockRepository = {
  findOne: jest.fn(),
};

const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockRepository),
};

const mockGqlExecutionContext = GqlExecutionContext as jest.Mocked<
  typeof GqlExecutionContext
>;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtKeyService, useValue: mockJwtKeyService },
        { provide: NestJwtService, useValue: mockJwtService },
        { provide: Reflector, useValue: mockReflector },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jest.clearAllMocks();
  });

  const createMockContext = (headers: Record<string, string>): ExecutionContext => {
    const mockReq = { headers };
    const mockGqlContext = {
      getContext: () => ({ req: mockReq }),
      getHandler: () => {},
      getClass: () => {},
    };
    mockGqlExecutionContext.create.mockReturnValue(mockGqlContext as any);
    return {
      getHandler: () => {},
      getClass: () => {},
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for a public route', async () => {
      const context = createMockContext({});
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      expect(mockJwtKeyService.getPubKey).not.toHaveBeenCalled();
    });

    it('should return true and attach user for a valid token', async () => {
      const mockUser = { id: 'user-sub', username: 'test' } as User;
      const mockPayload = { sub: 'user-sub' };
      const context = createMockContext({
        authorization: 'Bearer valid-token',
      });
      const mockReq = mockGqlExecutionContext.create(context).getContext().req;

      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockJwtKeyService.getPubKey.mockResolvedValue('public-key');
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid-token',
        expect.objectContaining({ publicKey: 'public-key' }),
      );
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
        relations: {},
      });
      expect(mockReq.user).toBe(mockUser);
    });

    it('should throw BadRequestException for missing auth header', async () => {
      const context = createMockContext({});
      mockReflector.getAllAndOverride.mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid auth header', async () => {
      const context = createMockContext({ authorization: 'invalid-token' });
      mockReflector.getAllAndOverride.mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException for an expired token', async () => {
      const context = createMockContext({
        authorization: 'Bearer expired-token',
      });
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockJwtKeyService.getPubKey.mockResolvedValue('public-key');
      mockJwtService.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('jwt expired', new Date());
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Expired JWT Token.',
      );
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
      const context = createMockContext({
        authorization: 'Bearer invalid-token',
      });
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockJwtKeyService.getPubKey.mockResolvedValue('public-key');
      mockJwtService.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid JWT Token provided.',
      );
    });

    it('should throw UnauthorizedException for other verify errors', async () => {
      const context = createMockContext({
        authorization: 'Bearer other-error-token',
      });
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockJwtKeyService.getPubKey.mockResolvedValue('public-key');
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Some other error');
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Some other error',
      );
    });
  });
});

