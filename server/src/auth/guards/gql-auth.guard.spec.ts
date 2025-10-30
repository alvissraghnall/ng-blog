import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let mockGqlExecutionContext: jest.Mocked<typeof GqlExecutionContext>;

  beforeEach(() => {
    guard = new GqlAuthGuard();
    mockGqlExecutionContext = GqlExecutionContext as jest.Mocked<
      typeof GqlExecutionContext
    >;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('getRequest', () => {
    it('should extract request and attach args.loginUserInput to body', () => {
      const mockLoginUserInput = { username: 'test', password: '123' };
      const mockRequest = {};
      const mockContext = {
        getContext: () => mockRequest,
        getArgs: () => ({ loginUserInput: mockLoginUserInput }),
      };

      mockGqlExecutionContext.create.mockReturnValue(
        mockContext as any,
      );

      const result = guard.getRequest({} as ExecutionContext);

      expect(GqlExecutionContext.create).toHaveBeenCalledWith({});
      expect(result).toBe(mockRequest);
      expect((result as any).body).toEqual(mockLoginUserInput);
    });
  });
});
