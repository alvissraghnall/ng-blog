import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ENTITY_OWNER_KEY,
  EntityOwnerMetadata,
} from 'common/decorators/entity-owner.decorator';

@Injectable()
export class EntityOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<EntityOwnerMetadata>(
      ENTITY_OWNER_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();
    const user = req?.user;

    if (!user) {
      throw new ForbiddenException('User authentication required.');
    }

    const repository = this.moduleRef.get<Repository<any>>(
      getRepositoryToken(metadata.entity),
      { strict: false },
    );

    const args = gqlCtx.getArgs();
    const entityId = metadata.idExtractor(args);

    if (!entityId) {
      throw new NotFoundException(
        `${metadata.entity.name} identifier not provided`,
      );
    }

    const entityKey = metadata.entityKey || 'id';
    const ownerKey = metadata.ownerKey || 'author';

    const entity = await repository.findOne({
      where: { [entityKey]: entityId } as any,
      relations: [ownerKey],
    });

    if (!entity) {
      throw new NotFoundException(
        `${metadata.entity.name} with ${entityKey} = ${entityId} not found`,
      );
    }

	console.log(entity);

    const owner = entity[ownerKey];
    const ownerId = typeof owner === 'object' ? owner.id : owner;
    const userId = user.id ?? user;

    if (ownerId !== userId) {
      throw new ForbiddenException(
        `You do not have permission to modify this ${metadata.entity.name}`,
      );
    }

    req.entity = entity;

    return true;
  }
}
