import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { map, distinctUntilChanged, tap, shareReplay, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getOAuthUrl, login as gqlLogin, oauthLogin, signup, updateUser } from '@graphql/mutations';
import { MutationOauthLoginArgs, User } from '@/gql-types';
import { getCurrentUser as getCurrUser } from '@graphql/queries';
import { AuthenticationError, NetworkError, ValidationError } from '@core/models/errors.model';
import { ResultOf } from '@graphql-typed-document-node/core';

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

  /**
   * Login with username and password
   * @throws {AuthenticationError} When credentials are invalid
   * @throws {NetworkError} When network request fails
   */
  login(credentials: { username: string; password: string }): Observable<{ user: User; token: string }> {
    return this.apollo
      .mutate({
        mutation: gqlLogin,
        variables: {
          loginUserInput: { ...credentials },
        },
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.login) {
            throw new AuthenticationError(result.error?.message || 'Login failed. Please check your credentials.');
          }

          const { user, access_token } = result.data.login;

          if (!user || !access_token) {
            throw new AuthenticationError('Invalid response from server');
          }

          return { user, token: access_token };
        }),
        tap(({ user, token }) => {
          this.setAuth(user, token);
        }),
        catchError(error => {
          this.purgeAuth();

          if (error instanceof AuthenticationError) {
            return throwError(() => error);
          }

          const networkError = new NetworkError(error.message || 'Unable to connect to server. Please try again.');
          return throwError(() => networkError);
        }),
      );
  }

  /**
   * Register a new user
   * @throws {ValidationError} When registration data is invalid
   * @throws {NetworkError} When network request fails
   */
  register(credentials: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<ResultOf<typeof signup>['signup']> {
    return this.apollo
      .mutate({
        mutation: signup,
        variables: {
          createUserInput: { ...credentials },
        },
      })
      .pipe(
        map(result => {
          console.log(result);
          if (result.error || !result.data?.signup) {
            throw new ValidationError(result.error?.message || 'Registration failed. Please check your information.');
          }
          return result.data.signup;
        }),
        catchError(error => {
          if (error instanceof ValidationError) {
            return throwError(() => error);
          }

          const networkError = new NetworkError(error.message || 'Unable to register. Please try again.');
          return throwError(() => networkError);
        }),
      );
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(['/']);
  }

  /**
   * Get OAuth URL for provider
   * @throws {NetworkError} When request fails
   */
  getOAuthUrl(provider: 'github' | 'google'): Observable<string> {
    return this.apollo
      .mutate({
        mutation: getOAuthUrl,
        variables: { provider },
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.getOAuthUrl) {
            throw new NetworkError('Unable to get OAuth URL. Please try again.');
          }
          return result.data.getOAuthUrl;
        }),
        catchError(error => {
          const networkError = new NetworkError(error.message || 'OAuth initialization failed.');
          return throwError(() => networkError);
        }),
      );
  }

  /**
   * Complete OAuth login
   * @throws {AuthenticationError} When OAuth login fails
   */
  oauthLogin(credentials: MutationOauthLoginArgs['oauthInput']): Observable<{ user: User; token: string }> {
    return this.apollo
      .mutate({
        mutation: oauthLogin,
        variables: {
          oauthInput: credentials,
        },
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.oauthLogin) {
            throw new AuthenticationError(result.error?.message || 'OAuth login failed. Please try again.');
          }

          const { user, access_token } = result.data.oauthLogin;

          if (!user || !access_token) {
            throw new AuthenticationError('Invalid OAuth response from server');
          }

          return { user, token: access_token };
        }),
        tap(({ user, token }) => {
          this.setAuth(user, token);
        }),
        catchError(error => {
          this.purgeAuth();

          if (error instanceof AuthenticationError) {
            return throwError(() => error);
          }

          const authError = new AuthenticationError(error.message || 'OAuth authentication failed.');
          return throwError(() => authError);
        }),
      );
  }

  /**
   * Get current authenticated user
   * @throws {AuthenticationError} When user is not authenticated
   */
  getCurrentUser(): Observable<User> {
    return this.apollo
      .query({
        query: getCurrUser,
        fetchPolicy: 'cache-only',
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.whoami) {
            throw new AuthenticationError('Session expired. Please login again.');
          }
          return result.data.whoami;
        }),
        tap(user => {
          this.setAuth(user);
        }),
        catchError(error => {
          this.purgeAuth();

          const authError = new AuthenticationError(
            error.message || 'Unable to verify authentication. Please login again.',
          );
          return throwError(() => authError);
        }),
        shareReplay(1),
      );
  }

  /**
   * Update user profile
   * @throws {ValidationError} When update data is invalid
   * @throws {AuthenticationError} When user is not authenticated
   */
  update(user: Pick<User, 'avatar' | 'bio' | 'password'>): Observable<User> {
    const currentUser = this.currentUserSubject.getValue();

    if (!currentUser) {
      this.purgeAuth();
      return throwError(() => new AuthenticationError('Not authenticated. Please login.'));
    }

    return this.apollo
      .mutate({
        mutation: updateUser,
        variables: {
          updateUserInput: {
            ...user,
            id: currentUser.id,
          },
        },
      })
      .pipe(
        map(result => {
          if (result.error || !result.data?.updateUser) {
            throw new ValidationError(result.error?.message || 'Unable to update profile. Please try again.');
          }
          return result.data.updateUser;
        }),
        tap(updatedUser => {
          this.currentUserSubject.next(updatedUser);
        }),
        catchError(error => {
          if (error instanceof ValidationError) {
            return throwError(() => error);
          }

          if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
            this.purgeAuth();
            return throwError(() => new AuthenticationError('Session expired. Please login again.'));
          }

          const validationError = new ValidationError(error.message || 'Unable to update profile.');
          return throwError(() => validationError);
        }),
      );
  }

  private setAuth(user: User, token?: string): void {
    if (token) {
      this.jwtService.saveToken(token);
    }
    this.currentUserSubject.next(user);
  }

  private purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}
