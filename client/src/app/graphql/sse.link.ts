import { ApolloLink, Observable } from '@apollo/client/core';
import { print, GraphQLError, ExecutionResult } from 'graphql';
import { createClient, ClientOptions, Client, RequestParams } from 'graphql-sse';

export class SSELink extends ApolloLink {
  private client: Client;
  private readonly operationsByRequest = new WeakMap<RequestParams, ApolloLink.Operation>();

  constructor(options: ClientOptions) {
    super();
    this.client = createClient({
      ...options,
      headers: async request => {
        const operation: ApolloLink.Operation = this.operationsByRequest.get(request)!;
        return {
          ...(typeof options.headers === 'function' ? await options.headers(request) : options.headers),

          ...operation.getContext().headers,
        };
      },
    });
  }

  public override request(operation: ApolloLink.Operation): Observable<ExecutionResult> {
    const request: RequestParams = {
      ...operation,
      query: (operation.getContext()['http']?.includeQuery ?? true) ? print(operation.query) : undefined!,
    };

    this.operationsByRequest.set(request, operation);

    return new Observable(sink => {
      return this.client.subscribe<ExecutionResult>(request, {
        next: sink.next.bind(sink),
        complete: sink.complete.bind(sink),
        error: sink.error.bind(sink),
      });
    });
  }
}
