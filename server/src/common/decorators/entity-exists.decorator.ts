import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ENTITY_EXISTS_KEY = 'entity-exists-metadata';

// export interface EntityExistsMetadata {
//   entity: any;
//   entityKey?: string;
//   idExtractor: (args: any) => any;
//   attachAs?: string; //name to attach entity as in args
// }

// export const CheckEntityExists = (metadata: EntityExistsMetadata) =>
//   SetMetadata(ENTITY_EXISTS_KEY, metadata);

export const FoundEntity = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    const args = gqlCtx.getArgs();

    // If data is provided, use it as the key, otherwise use the entity attached to args
    if (data) {
      return args[data];
    }

    // Find the first entity property in args (the one we attached)
    const entityKeys = Object.keys(args).filter(
      (key) => args[key] && typeof args[key] === 'object' && args[key].id,
    );

    return entityKeys.length > 0 ? args[entityKeys[0]] : null;
  },
);

export type PathTo<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${PathTo<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

export type PathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export interface EntityExistsMetadata<
  ArgsType = any,
  EntityType = any,
  AttachPath extends string = string,
  IdPath extends string = string,
> {
  /** The entity class (TypeORM entity, usually). */
  entity: new (...args: any[]) => EntityType;

  /**
   * Extracts the entity ID from resolver args.
   * Can be either:
   *  - a function: (args) => args.createCommentInput.postId
   *  - a string path: 'createCommentInput.postId'
   */
  idExtractor: ((args: ArgsType) => PathValue<ArgsType, IdPath>) | IdPath;

  /** Optional DB key (default: 'id'). */
  entityKey?: string;

  /** Where to attach the loaded entity (supports nested path). */
  attachAs?: AttachPath;
  /**
   * Optional override for key name (if different from default).
   */
  entityKeyOverride?: string;
}

export const CheckEntityExists = <
  ArgsType,
  EntityType,
  AttachPath extends string = string,
  IdPath extends string = string,
>(
  metadata: EntityExistsMetadata<ArgsType, EntityType, AttachPath, IdPath>,
) => SetMetadata(ENTITY_EXISTS_KEY, metadata);

export function CheckEntityExistsFor<
  Args,
  Entity,
  Attach extends PathTo<Args> = PathTo<Args>,
  Id extends PathTo<Args> = PathTo<Args>,
>(metadata: EntityExistsMetadata<Args, Entity, Attach, Id>) {
  return CheckEntityExists(metadata);
}
