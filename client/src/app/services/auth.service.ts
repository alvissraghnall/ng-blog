import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_USER } from '../graphql/auth.queries';
import { CreateUserInput } from '../models/inputs/create-user.input';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loading = false;
  errors!: any[];
  responseData: any;

  constructor(
    private readonly apollo: Apollo
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

  login() {
    
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
