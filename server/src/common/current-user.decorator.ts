import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        console.log("user from deco: ", GqlExecutionContext.create(ctx).getContext().req.user);

        return GqlExecutionContext.create(ctx).getContext().req.user
    }
)