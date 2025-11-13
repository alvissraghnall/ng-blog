import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { passwordMatchValidator } from '@core/validators/password-match.validator';
import { ZardFormModule } from '@ui/form/form.module';
import { Errors } from '@core/models/errors.model';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardFormModule,
    ZardInputDirective,
    ZardIconComponent,
  ],
  templateUrl: './auth.component.html',
  styles: ``,
})
export class AuthComponent implements OnInit {
  @Input({ required: true }) mode: 'signIn' | 'signUp' = 'signIn';
  @Input() submitButtonText: string = 'Submit';
  private readonly destroyRef = inject(DestroyRef);
  errors: Errors = { errors: {} };

  submitForm = output<FormGroup>();

  authForm!: FormGroup;
  passwordVisible = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    const controls = {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    };

    if (this.mode === 'signUp') {
      (controls as any).confirmPassword = ['', Validators.required];
      (controls as any).avatar = [''];
      (controls as any).email = ['', [Validators.required, Validators.email]];
    }

    this.authForm = this.fb.group(controls, {
      validators: this.mode === 'signUp' ? passwordMatchValidator : [],
    });
  }

  togglePasswordVisibility(ev: Event): void {
    console.log(ev, 3009);
    ev.preventDefault();
    ev.stopPropagation();
    console.log(this.passwordVisible());
    this.passwordVisible.set(!this.passwordVisible());
    console.log(this.passwordVisible());
  }

  getUsernameError(): string {
    if (!this.username?.touched) return '';

    if (this.username?.errors?.['required']) {
      return 'Username is required';
    }
    if (this.username?.errors?.['minlength']) {
      return 'Username must be at least 3 characters';
    }
    return '';
  }

  getEmailError(): string {
    if (!this.email?.touched) return '';

    if (this.email?.errors?.['required']) {
      return 'Email is required';
    }
    if (this.email?.errors?.['minlength']) {
      return 'Email must be at least 3 characters';
    }
    return '';
  }

  getPasswordError(): string {
    if (!this.password?.touched) return '';

    if (this.password?.errors?.['required']) {
      return 'Password is required';
    }
    if (this.password?.errors?.['minlength']) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (!this.confirmPassword?.touched) return '';

    if (this.confirmPassword?.errors?.['required']) {
      return 'Please confirm your password';
    }
    if (this.authForm?.errors?.['passwordMismatch'] && this.confirmPassword?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  get username() {
    return this.authForm.get('username');
  }
  get email() {
    return this.authForm.get('email');
  }
  get password() {
    return this.authForm.get('password');
  }
  get confirmPassword() {
    return this.authForm.get('confirmPassword');
  }
  get avatar() {
    return this.authForm.get('avatar');
  }

  onSubmit(): void {
    this.isSubmitting.set(true);

    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.submitForm.emit(this.authForm);
    }

    this.isSubmitting.set(false);
  }
}
