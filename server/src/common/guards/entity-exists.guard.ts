import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ENTITY_EXISTS_KEY,
  EntityExistsMetadata,
} from 'common/decorators/entity-exists.decorator';

@Injectable()
export class EntityExistsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.get<EntityExistsMetadata>(
      ENTITY_EXISTS_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return true;
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const args = gqlCtx.getArgs();

    console.log(args);

    const repository = this.moduleRef.get<Repository<any>>(
      getRepositoryToken(metadata.entity),
      { strict: false },
    );

    const entityId =
      typeof metadata.idExtractor === 'function'
        ? metadata.idExtractor(args)
        : this.getNestedProperty(args, metadata.idExtractor);

    if (entityId == null) {
      throw new BadRequestException(`${metadata.entity.name} ID not provided`);
    }

    const entityKey = metadata.entityKey || 'id';

    const entity = await repository.findOneBy({
      [entityKey]: entityId,
    } as any);

    if (!entity) {
      throw new NotFoundException(
        `${metadata.entity.name} with ${entityKey} = ${entityId} does not exist`,
      );
    }

    const attachPath = metadata.attachAs || metadata.entity.name.toLowerCase();
    this.setNestedProperty(args, attachPath, entity);

    return true;
  }

  private setNestedProperty(obj: any, path: string, value: any) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (current[key] == null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[parts[parts.length - 1]] = value;
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
  }
}
