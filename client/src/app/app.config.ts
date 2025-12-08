import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtService } from './core/auth/services/jwt.service';
import { UserService } from './core/auth/services/user.service';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { EMPTY } from 'rxjs';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext, SetContextLink } from '@apollo/client/link/context';
import { Kind, OperationTypeNode } from 'graphql';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { SSELink } from './graphql/sse.link';

import { provideQuillConfig } from 'ngx-quill';
import { environment } from '@/environments/environment';

export function initAuth(jwtService: JwtService, userService: UserService) {
  return () => (jwtService.getToken() ? userService.getCurrentUser() : EMPTY);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(withInterceptors([apiInterceptor, tokenInterceptor, errorInterceptor])),

    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const jwtService = inject(JwtService);

      const authLink = new SetContextLink((prevContext, operation) => {
        const token = jwtService.getToken();
        if (!token) return {};
        return {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Apollo-Require-Preflight': 'true',
          }),
        };
      });

      const uploadLink = new UploadHttpLink({
        uri: '/graphql',
        headers: {
          'Apollo-Require-Preflight': 'true',
        },
      });

      const httpLinkChain = ApolloLink.from([authLink, uploadLink]);

      const sseLink = new SSELink({
        url: environment.graphQLStreamUrl,
        singleConnection: false,
        headers: () => {
          const token = jwtService.getToken();
          return { Authorization: token ? `Bearer ${token}` : '' };
        },
      });

      const link = ApolloLink.split(
        ({ query, operationType }) => {
          // const definition = getMainDefinition(query);
          return operationType === OperationTypeNode.SUBSCRIPTION;
          // definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION
        },
        sseLink,
        httpLinkChain,
      );

      return {
        link: link,
        cache: new InMemoryCache(),
      };
    }),

    provideAppInitializer(() => {
      return initAuth(inject(JwtService), inject(UserService))();
    }),

    provideQuillConfig({
      modules: {
        syntax: true,
        toolbar: true,
        theme: 'snow',
      },
      customOptions: [
        {
          import: 'formats/font',
          whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'],
        },
      ],
    }),
  ],
};
