import { Component, EventEmitter, Input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { passwordMatchValidator } from '@core/validators/password-match.validator';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective, ZardIconComponent],
  templateUrl: './auth.component.html',
  styles: ``,
})
export class AuthComponent implements OnInit {
  @Input({ required: true }) mode: 'signIn' | 'signUp' = 'signIn';
  @Input() submitButtonText: string = 'Submit';

  submitForm = output<FormGroup>();

  authForm!: FormGroup;
  passwordVisible = false;

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
    }

    this.authForm = this.fb.group(controls, {
      validators: this.mode === 'signUp' ? passwordMatchValidator : [],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get username() {
    return this.authForm.get('username');
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
    this.authForm.markAllAsTouched();
    if (this.authForm.valid) {
      this.submitForm.emit(this.authForm);
    }
  }
}
