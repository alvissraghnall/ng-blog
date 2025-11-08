import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from 'common/entities/base.entity';

export function EntityExistsPipe<
  EntityCls extends BaseEntity,
  DtoType extends Record<string, any>,
  DtoKey extends keyof DtoType = keyof DtoType,
>(
  entityCls: Type<EntityCls>,
  dtoKey: DtoKey,
  entityKey: keyof EntityCls = 'id',
): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeHost implements PipeTransform<DtoType> {
    constructor(
      @InjectRepository(entityCls)
      private readonly repo: Repository<EntityCls>,
    ) {}

    async transform(value: DtoType) {
      const entityId = value[dtoKey];
      if (entityId == null)
        throw new BadRequestException('No post ID provided!');

      const entity = await this.repo.findOneBy({
        [entityKey]: entityId,
      } as FindOptionsWhere<EntityCls>);

      if (!entity) {
        throw new NotFoundException(
          `${entityCls.name} with ${String(entityKey)} = ${entityId} does not exist`,
        );
      }

      (value as any)[entityCls.name.toLowerCase()] = entity;

      return value;
    }
  }

  return EntityExistsPipeHost;
}
