import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ENTITY_OWNER_KEY = 'entity-owner-metadata';

export interface EntityOwnerMetadata {
  entity: any;
  entityKey?: string;
  ownerKey?: string;
  idExtractor: (args: any) => any;
}

export const CheckEntityOwner = (metadata: EntityOwnerMetadata) =>
  SetMetadata(ENTITY_OWNER_KEY, metadata);

export const OwnedEntity = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();
    console.log(req.entity);
    return req.entity;
  },
);
