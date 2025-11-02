import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { of, firstValueFrom, Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'common/public.decorator';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('GqlJwtAuthGuard', () => {
  let guard: GqlJwtAuthGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  const mockGqlContext = {
    getContext: () => ({ req: 'mockReq' }),
    getHandler: () => ({}),
    getClass: () => ({}),
  };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new GqlJwtAuthGuard(reflector);
    mockContext = {} as ExecutionContext;

    (GqlExecutionContext.create as jest.Mock).mockReturnValue(
      mockGqlContext as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('getRequest', () => {
    it('should extract request from GQL context', () => {
      const req = guard.getRequest(mockContext);
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
      expect(req).toBe('mockReq');
    });
  });

  describe('canActivate', () => {
    it('should return true if route is public', async () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);

      const superSpy = jest.spyOn(Object.getPrototypeOf(guard), 'canActivate');
      mockContext = {
        getHandler: () => ({}) as Function,
        getClass: () => ({}) as any,
      } as any;

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(superSpy).toHaveBeenCalled();
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler?.(),
        mockContext.getClass?.(),
      ]);
    });

    it('should call super.canActivate if route is not public', (done) => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

      const superSpy = jest
        .spyOn(Object.getPrototypeOf(guard), 'canActivate')
        .mockReturnValue(of(true));

      (guard.canActivate(mockContext) as Observable<boolean>).subscribe(
        (result) => {
          expect(result).toBe(true);
          expect(superSpy).toHaveBeenCalledWith(mockContext);
          done();
        },
      );
    });
  });
});
