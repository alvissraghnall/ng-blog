import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { CREATE_USER, LOGIN_USER } from '../graphql/auth.queries';
import { CreateUserInput } from '../models/inputs/create-user.input';
import { LoginUserInput } from '../models/inputs/login-user.input';
import { KeyStorageService } from './key-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loading = false;
  errors!: any[];
  responseData: any;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly apollo: Apollo,
    private readonly keyStorageService: KeyStorageService
  ) { }

  signup (input: CreateUserInput, loadingVar: boolean) {
    return this.apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        input
      },
      errorPolicy: 'all'
      
    });
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

  private setSession(token: string) {
    this.keyStorageService.setToken(token);
  } 

  logout(): void {
    this.keyStorageService.removeToken();
    this.apollo.client.resetStore();
    this.isAuthenticated.next(false);
  }

  public isLoggedIn() {
    return this.keyStorageService.getToken() !== null
      && this.apollo.query({
        query: 
      })
    ;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
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
