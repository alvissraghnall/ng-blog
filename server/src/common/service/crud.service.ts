import { Injectable, Logger, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity } from 'common/entities/base.entity';
import { DeepPartial, Repository } from 'typeorm';

type CreateEntityInput<EntityCls extends BaseEntity> = DeepPartial<EntityCls>;

export interface ICrudService<EntityCls extends BaseEntity> {
  repo: Repository<EntityCls>;

  findAll(): Promise<EntityCls[]>;
  create(input: CreateEntityInput<EntityCls>): Promise<EntityCls>;
}

export const CrudService = <EntityCls extends BaseEntity>(
  entityCls: Type<EntityCls>,
): Type<ICrudService<EntityCls>> => {
  @Injectable()
  class CrudServiceHost implements ICrudService<EntityCls> {
    private readonly logger = new Logger(`${entityCls.name}CrudService`);

    constructor(
      @InjectRepository(entityCls)
      public readonly repo: Repository<EntityCls>,
    ) {}

    findAll() {
      this.logger.debug(`Searching for all ${entityCls.name} records`);
      return this.repo.find();
    }

    create(input: CreateEntityInput<EntityCls>) {
      this.logger.debug(
        `Inserting ${entityCls.name} record: (${JSON.stringify(input)})`,
      );
      return this.repo.save(input);
    }
  }
  return CrudServiceHost;
};
