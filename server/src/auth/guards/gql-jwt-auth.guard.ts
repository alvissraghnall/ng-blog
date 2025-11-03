import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'common/public.decorator';
import { Observable } from 'rxjs';
import { User } from 'users/entities/user.entity';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    try {
      //console.log(new Date(), context, 39);
      return super.canActivate(context);
    } catch (err) {
      console.log(err, 4444);
      if (err instanceof Error && err.message === 'No auth token') {
        throw new UnauthorizedException(err.message);
      } else throw err;
    }
  }

  handleRequest<User>(
    err: unknown,
    user: User,
    info: string | Error,
    context: ExecutionContext,
    status?: unknown,
  ): User {
    console.log({ err, user, info, context, status });

    if (info instanceof Error) {
      if (info.message === 'No auth token') {
        throw new UnauthorizedException('Invalid Authorization Header');
      }
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Your token has expired. Please log in again.',
        );
      }
      if (info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid JWT Token provided.');
      }

      throw new UnauthorizedException(info.message);
    }

    if (typeof info === 'string') {
      throw new UnauthorizedException(info);
    }

    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
