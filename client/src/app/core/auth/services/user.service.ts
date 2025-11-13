import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';

import { JwtService } from './jwt.service';
import { map, distinctUntilChanged, tap, shareReplay, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getOAuthUrl, login as gqlLogin, oauthLogin, signup, updateUser } from '@graphql/mutations';
import { MutationOauthLoginArgs, User } from '@/gql-types';
import { ApolloClient, MutateResult } from '@apollo/client';
import { getCurrentUser as getCurrUser } from '@graphql/queries';
import { register } from 'e2e/helpers/auth';
import { OptionalAttributes } from 'quill';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map(user => !!user));

  constructor(
    private readonly jwtService: JwtService,
    private readonly router: Router,
    private readonly apollo: Apollo,
  ) {}

  login(credentials: { username: string; password: string }) {
    return this.apollo
      .mutate({
        mutation: gqlLogin,
        variables: {
          loginUserInput: { ...credentials },
        },
      })
      .pipe(
        tap(val => {
          if (val.error) {
            throw new Error(val.error.message);
          }
          if (val.data?.login.user) {
            this.setAuth(val.data?.login.user, val.data?.login.access_token);
          }
        }),
        catchError(val => of(val.message)),
      );
  }

  register(credentials: { username: string; email: string; password: string; confirmPassword: string }) {
    return this.apollo.mutate({
      mutation: signup,
      variables: {
        createUserInput: { ...credentials },
      },
    });
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(['/']);
  }

  getOAuthUrl(provider: 'github' | 'google') {
    return this.apollo.mutate({
      mutation: getOAuthUrl,
      variables: {
        provider,
      },
    });
  }

  oauthLogin(credentials: MutationOauthLoginArgs['oauthInput']) {
    return this.apollo
      .mutate({
        mutation: oauthLogin,
        variables: {
          oauthInput: credentials,
        },
      })
      .pipe(
        tap({
          next: res => {
            if (res.error) {
              this.purgeAuth();
            }
            let login = res.data?.oauthLogin;
            if (login) {
              this.setAuth(login.user, login.access_token);
            }
          },
          error: () => this.purgeAuth(),
        }),
      );
  }

  getCurrentUser() {
    return this.apollo
      .query({
        query: getCurrUser,
      })
      .pipe(
        tap({
          next: user => {
            if (user.error) {
              this.purgeAuth();
            }
            let whoami = user.data?.whoami;
            if (whoami) {
              this.setAuth(whoami);
            }
          },
          error: () => {
            this.purgeAuth();
          },
        }),
        shareReplay(1),
      );
  }

  update(user: Pick<User, 'avatar' | 'bio' | 'password'>) {
    const __user = this.currentUserSubject.getValue();
    if (!__user) {
      this.purgeAuth();
      return;
    }
    return this.apollo
      .mutate({
        mutation: updateUser,
        variables: {
          updateUserInput: {
            ...user,
            id: __user.id,
          },
        },
      })
      .pipe(
        tap(response => {
          if (response.error || !response.data?.updateUser) {
            throw new Error(response.error?.message, {
              cause: response.error?.stack,
            });
          }
          this.currentUserSubject.next(response.data?.updateUser);
        }),
      );
  }

  private handleError(operation = 'operation') {
    return (error: any) => {
      let message = 'An unknown error occurred';
      if (error instanceof ApolloError) {
        message = error.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      console.error(`[UserService] ${operation} failed:`, error);
      // Optionally, use a toast or a global error service here
      // this.toastService.error(message);

      return throwError(() => new Error(message));
    };
  }

  setAuth(user: User, token?: string): void {
    if (token) {
      this.jwtService.saveToken(token);
    }
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
