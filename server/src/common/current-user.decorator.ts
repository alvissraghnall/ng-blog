import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from 'users/entities/user.entity';

export const getCurrentUserFromContext = (
  ctx: ExecutionContext,
): User => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const request = gqlCtx.getContext().req;
  console.log('user from deco: ', request.user);
  return request.user;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserFromContext(ctx),
);
