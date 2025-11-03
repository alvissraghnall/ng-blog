import { GraphQLError } from 'graphql';

export class ForbiddenError extends GraphQLError {
  constructor(message: string = 'Access forbidden') {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}

export class ConflictError extends GraphQLError {
  constructor(message: string = 'Resource already exists') {
    super(message, {
      extensions: {
        code: 'CONFLICT',
      },
    });
  }
}
