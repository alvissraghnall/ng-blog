import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { of, Observable } from 'rxjs';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('GqlJwtAuthGuard', () => {
  let guard: GqlJwtAuthGuard;
  let mockGqlExecutionContext: jest.Mocked<typeof GqlExecutionContext>;
  let mockContext: ExecutionContext;

  const mockGqlContext = {
    getContext: () => ({ req: 'mockReq' }),
    getHandler: () => ({}),
    getClass: () => ({}),
  };

  beforeEach(() => {
    guard = new GqlJwtAuthGuard();
    mockContext = {} as ExecutionContext;

    mockGqlExecutionContext = GqlExecutionContext as jest.Mocked<
      typeof GqlExecutionContext
    >;
    mockGqlExecutionContext.create.mockReturnValue(
      mockGqlContext as any,
    );

    jest.spyOn(Object.getPrototypeOf(guard), 'canActivate').mockReturnValue(of(true));
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
    it('should return true if handler is public', () => {
      jest
        .spyOn(mockGqlContext, 'getHandler')
        .mockReturnValue({ isPublic: true });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(
        Object.getPrototypeOf(guard).canActivate,
      ).not.toHaveBeenCalled();
    });

    it('should return true if class is public', () => {
      jest
        .spyOn(mockGqlContext, 'getClass')
        .mockReturnValue({ isPublic: true });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(
        Object.getPrototypeOf(guard).canActivate,
      ).not.toHaveBeenCalled();
    });

    it('should call super.canActivate if not public', (done) => {
      jest
        .spyOn(mockGqlContext, 'getHandler')
        .mockReturnValue({ isPublic: false });
      jest
        .spyOn(mockGqlContext, 'getClass')
        .mockReturnValue({ isPublic: false });

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
