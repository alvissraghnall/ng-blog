import { Component, DestroyRef, inject, Input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { ZardFormModule } from '@ui/form/form.module';

import { passwordMatchValidator } from '@core/validators/password-match.validator';
import { Errors } from '@core/models/errors.model';
import { UserService } from './services/user.service';

export type SignInForm = {
  username: FormControl<string>;
  password: FormControl<string>;
};

export type SignUpForm = {
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  email: FormControl<string>;
  avatar: FormControl<string>;
};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ZardFormModule,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardIconComponent,
  ],
  templateUrl: './auth.component.html',
  styles: '',
})
export class AuthComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  @Input({ required: true }) mode: 'signIn' | 'signUp' = 'signIn';
  @Input() submitButtonText = 'Submit';
  submitForm = output<FormGroup<SignInForm | SignUpForm>>();

  authForm!: FormGroup<SignInForm | SignUpForm>;
  
  passwordVisible = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.buildForm();
    
    const errorParam = this.route.snapshot.queryParamMap.get('error');
    if (errorParam) {
      this.errorMessage.set(errorParam);
    }
  }

  onGoogleSignIn() {
    this.initiateOAuth('google');
  }

  onGithubSignIn() {
    this.initiateOAuth('github');
  }

  private initiateOAuth(provider: 'google' | 'github') {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.userService.getOAuthUrl(provider)
      .pipe(
        take(1),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: (url) => {
          window.location.href = url;
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Failed to initialize login.');
        }
      });
  }

  private buildForm(): void {
    if (this.mode === 'signUp') {
      this.authForm = this.fb.nonNullable.group<SignUpForm>(
        {
          username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
          password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
          confirmPassword: this.fb.nonNullable.control('', Validators.required),
          email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
          avatar: this.fb.nonNullable.control(''),
        },
        { validators: passwordMatchValidator },
      ) as FormGroup<SignUpForm | SignInForm>;
    } else {
      this.authForm = this.fb.nonNullable.group<SignInForm>({
        username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
        password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
      });
    }
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.passwordVisible.update(v => !v);
  }

  get username(): FormControl<string> { return this.authForm.get('username') as FormControl<string>; }
  get email(): FormControl<string> | null { return this.mode === 'signUp' ? (this.authForm.get('email') as FormControl<string>) : null; }
  get password(): FormControl<string> { return this.authForm.get('password') as FormControl<string>; }
  get confirmPassword(): FormControl<string> | null { return this.mode === 'signUp' ? (this.authForm.get('confirmPassword') as FormControl<string>) : null; }
  get avatar(): FormControl<string> | null { return this.mode === 'signUp' ? (this.authForm.get('avatar') as FormControl<string>) : null; }

  getUsernameError(): string {
    const ctrl = this.username;
    if (!ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Username is required';
    if (ctrl.hasError('minlength')) return 'Username must be at least 3 characters';
    return '';
  }

  getEmailError(): string {
    const ctrl = this.email;
    if (!ctrl?.touched) return '';
    if (ctrl.hasError('required')) return 'Email is required';
    if (ctrl.hasError('email')) return 'Invalid email format';
    return '';
  }

  getPasswordError(): string {
    const ctrl = this.password;
    if (!ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Password is required';
    if (ctrl.hasError('minlength')) return 'Password must be at least 8 characters';
    return '';
  }

  getConfirmPasswordError(): string {
    const ctrl = this.confirmPassword;
    if (!ctrl?.touched) return '';
    if (ctrl.hasError('required')) return 'Please confirm your password';
    if (this.authForm.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  }

  onSubmit() {
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.submitForm.emit(this.authForm);
    }
  }

  finishSubmitting() {
    this.isSubmitting.set(false);
  }
}