import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, take } from 'rxjs';
import { CHECK_AUTH_USER_TOKEN, CREATE_USER, LOGIN_USER } from '../graphql/auth.queries';
import { CreateUserInput } from '../models/inputs/create-user.input';
import { LoginUserInput } from '../models/inputs/login-user.input';
import { User } from '../models/User.model';
import { KeyStorageService } from './key-storage.service';
import { UserStorageService } from './user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loading = false;
  errors!: any[];
  responseData: any;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUser?: User;

  constructor(
    private readonly apollo: Apollo,
    private readonly keyStorageService: KeyStorageService,
    private readonly userStorageService: UserStorageService
  ) { 
    this.currentUser = this.userStorageService.getCurrentUser();
  }

  signup (input: CreateUserInput, loadingVar: boolean) {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        input
      },
      errorPolicy: 'all'
      
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser (user: User) {
    this.userStorageService.setCurrentUser(user);
    this.currentUser = user;
  }

  login(input: LoginUserInput) {
    return this.apollo.mutate({
      mutation: LOGIN_USER,
      variables: {
        input
      },
      errorPolicy: 'all'
    });
  }

  setSession(token: string) {
    this.keyStorageService.setToken(token);
  } 

  logout(): void {
    this.keyStorageService.removeToken();
    this.userStorageService.removeCurrentUser();
    this.apollo.client.resetStore();
    this.isAuthenticated.next(false);
    // this.r
  }

  public async isLoggedIn() {
    const token = this.keyStorageService.getToken();
    return token !== null
      && await this.checkToken(token);
  }

  private checkToken (token: string) {
    let isValid = false;
    return new Promise<boolean>(resolve => {
      this.apollo.query({
        query: CHECK_AUTH_USER_TOKEN,
        errorPolicy: 'all',
      }).pipe(
        take(1)
      ).subscribe((result: any) => {
        isValid = !!result.data;
        if (result.errors) isValid = false;

        resolve(isValid);
      });
    });
  }

  isLoggedOut() {
    return !this.isLoggedIn();
    // this.isAuthenticated.
  }

  getLoading(): boolean {
    return this.loading;
  }

  getResponseData (): any {
    return this.responseData;
  }

  getError(): any {
    return this.errors;
  }

  whoami() {
    
  }
  
}
  /**
   * errors: Array [ {…} ]
​​
0: Object { message: "Bad Request Exception", extensions: {…} }
​​​
extensions: Object { code: "BAD_USER_INPUT", response: {…} }
​​​​
code: "BAD_USER_INPUT"
​​​​
response: Object { statusCode: 400, message: (1) […], error: "Bad Request" }
​​​​​
error: "Bad Request"
​​​​​
message: Array [ "username already exists" ]
​​​​​
statusCode: 400
   */
