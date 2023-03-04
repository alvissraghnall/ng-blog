import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUserInput } from 'src/app/models/inputs/login-user.input';
import { LoginResponse } from 'src/app/models/response/login.response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
    </div>
    <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
      <div class="max-w-md mx-auto">
        <div>
          <h1 class="text-2xl font-semibold capitalize">sign in</h1>
        </div>
        <form class="divide-y divide-gray-200" [formGroup]="loginForm" (ngSubmit)="onSubmit(loginForm)" >
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div class="relative mt-3">
              <input 
                auto-complete="off" 
                formControlName="username" 
                type="text"
                class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" 
                placeholder="Username"
                
              />
              <label 
                for="Username" 
                class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Username
              </label>
              <div *ngIf="loginForm.get('username')?.invalid && (loginForm.get('username')?.dirty)">
                Please provide a valid username.
              </div>
            </div>
            <div class="relative mt-3">
              <input 
                formControlName="password" 
                type="password" 
                class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" 
                placeholder="Password"
              />
              <label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
              <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)">
                Password must have at least 8 characters.
              </div>
            </div>
            <div class="relative">
              <button 
                class="bg-blue-500 text-white rounded-md px-2 py-1"
                type="submit"
                [disabled]="!loginForm.valid || isSubmitting"
                >
                  <span *ngIf="!isSubmitting;else loading" class="leading-3 text-lg">Submit</span>
                  <ng-template #loading>
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    <span class="leading-3 text-base">Loading...</span>
                  </ng-template>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div 
  class="flex items-center absolute top-1/2 left-4 w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" 
  role="alert"
  [ngClass]="{ 'hidden': !showToast }"
  *ngIf="!isSubmitting"
>
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg dark:bg-green-800 dark:text-green-200"
      [ngClass]="messageIsSuccess ? 'text-green-500 bg-green-100' : 'text-red-700 bg-red-200'"
    >
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Check icon</span>
    </div>
    <div class="ml-3 text-sm font-normal" *ngIf="requestErrors">{{
      requestErrors[0]?.extensions.response.message
    }}</div>
    <div class="ml-3 text-sm font-normal" *ngIf="responseData">
      Login successful!
    </div>
    <button 
      type="button" 
      class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
      aria-label="Close"
      (click)="closeToast()"
    >
      <span class="sr-only">Close</span>
      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
</div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitting: boolean = false;
  messageIsSuccess: boolean = false;
  responseData: LoginResponse | undefined | null;
  requestErrors: any;
  loginUserInput: LoginUserInput | null = null;
  showToast = false;
  
  constructor(
    private readonly fb: FormBuilder,
    protected readonly authService: AuthService,
    private readonly router: Router
  ) { }

  onSuccess (token: string) {
    this.authService.setSession(token);
  }

  onSubmit(form: FormGroup) {
    console.log({
      valid: form.valid,
      username: form.value.username,
      password: form.value.password
    });
    this.loginUserInput = {
      username: form.value.username,
      password: form.value.password,
    }
    this.authService.login(this.loginUserInput)
      .subscribe(
        (result: any) => {
          
          this.requestErrors = result.errors;
          this.isSubmitting = result.loading;
          this.responseData = result.data?.login as LoginResponse;

          
          if(this.requestErrors) {
            console.log(this.requestErrors); 
            this.messageIsSuccess = false;
          } else {
            this.messageIsSuccess = true;
          }
          this.showToastFn()

          if(this.responseData) {
            this.onSuccess(this.responseData.access_token);
            setTimeout(() => {
              this.router.navigateByUrl("/user");
            }, 5000)
          }
        }
      )
  }

  showToastFn () {
    this.showToast = true;
    setTimeout(() => {
      this.closeToast();
    }, 7000);
  }

  closeToast () {
    this.showToast = false;
  }

  async ngOnInit(): Promise<void> {
    
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });

    if(await this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/user");
    }
  }
  

}
