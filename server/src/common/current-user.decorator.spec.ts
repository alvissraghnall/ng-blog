import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  getCurrentUserFromContext,
  CurrentUser,
} from './current-user.decorator';
import { User } from 'users/entities/user.entity';

import { createParamDecorator } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  createParamDecorator: jest.fn(),
}));

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

const mockUser: User = {
  id: 'user-123',
  username: 'testuser',
  email: 'test@example.com',
} as User;

const mockGqlContext = {
  getContext: jest.fn().mockReturnValue({
    req: {
      user: mockUser,
    },
  }),
};

const mockGqlExecutionContextCreate = GqlExecutionContext.create as jest.Mock;
mockGqlExecutionContextCreate.mockReturnValue(mockGqlContext);

const mockExecutionContext = {} as ExecutionContext;

describe('CurrentUser Decorator', () => {
  describe('getCurrentUserFromContext', () => {
    it('should extract the user from the GraphQL context request', () => {
      const user = getCurrentUserFromContext(mockExecutionContext);

      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        mockExecutionContext,
      );

      expect(mockGqlContext.getContext).toHaveBeenCalled();

      expect(user).toEqual(mockUser);
    });
  });

  describe('CurrentUser', () => {
    it('should call createParamDecorator with a factory function', () => {
      expect(createParamDecorator).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should use getCurrentUserFromContext as the decorator factory', () => {
      const factory = (createParamDecorator as jest.Mock).mock.calls[0][0];

      const user = factory(null, mockExecutionContext);

      expect(user).toEqual(mockUser);
    });
  });
});
