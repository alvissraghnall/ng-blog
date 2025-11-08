import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    console.log('filt3r: ', exception);

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    if (exception.response?.statusCode === 400 && exception.response?.message) {
      return this.handleValidationError(exception);
    }

    if (this.isAuthError(exception)) {
      return this.formatAuthError(exception);
    }

    return this.handleUnknownError(exception);
  }

  private handleHttpException(exception: HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse() as any;
    const message = typeof response === 'string' ? response : response.message;

    const codeMap = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
    };

    const code = codeMap[status] || 'INTERNAL_SERVER_ERROR';

    throw new GraphQLError(Array.isArray(message) ? message[0] : message, {
      extensions: {
        code,
        statusCode: status,
        details: response.error,
      },
    });
  }

  private handleValidationError(exception: any) {
    const validationMessages = exception.response.message;

    if (Array.isArray(validationMessages)) {
      if (
        validationMessages.length > 0 &&
        typeof validationMessages[0] === 'object'
      ) {
        const formattedErrors = validationMessages.map((error) => ({
          field: error.property,
          errors: error.constraints
            ? Object.values(error.constraints)
            : [error.message || 'Validation failed'],
        }));

        throw new GraphQLError('Validation failed', {
          extensions: {
            code: 'VALIDATION_ERROR',
            errors: formattedErrors,
          },
        });
      } else {
        throw new GraphQLError('Validation failed', {
          extensions: {
            code: 'VALIDATION_ERROR',
            errors: validationMessages.map((msg) => ({
              field: 'input',
              errors: [msg],
            })),
          },
        });
      }
    }

    throw new GraphQLError('Validation failed', {
      extensions: {
        code: 'VALIDATION_ERROR',
        errors: [{ field: 'unknown', errors: [validationMessages] }],
      },
    });
  }

  private isAuthError(exception: any): boolean {
    return (
      exception.name === 'JsonWebTokenError' ||
      exception.name === 'TokenExpiredError' ||
      exception.message?.includes('Unauthorized')
    );
  }

  private formatAuthError(exception: any) {
    let code = 'UNAUTHENTICATED';
    let message = 'Authentication failed';

    if (exception.name === 'TokenExpiredError') {
      code = 'TOKEN_EXPIRED';
      message = 'Your session has expired';
    } else if (exception.name === 'JsonWebTokenError') {
      code = 'INVALID_TOKEN';
      message = 'Invalid authentication token';
    } else if (exception.message?.includes('Unauthorized')) {
      message = exception.message;
    }

    throw new GraphQLError(message, {
      extensions: {
        code,
        originalError: exception.message,
      },
    });
  }

  private handleUnknownError(exception: any) {
    console.error('Unhandled exception:', exception);

    const message =
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : exception.message || 'Internal server error';

    throw new GraphQLError(message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
