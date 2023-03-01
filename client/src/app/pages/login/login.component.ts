import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
                Passwords must have at least 8 characters.
              </div>
            </div>
            <div class="relative">
              <button 
                class="bg-blue-500 text-white rounded-md px-2 py-1"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  
  constructor(
    private readonly fb: FormBuilder,
    protected readonly authService: AuthService,
  ) { }

  onSubmit(form: FormGroup) {
    console.log({
      valid: form.valid,
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    })
  }

}
