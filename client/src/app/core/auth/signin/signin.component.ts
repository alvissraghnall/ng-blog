import { Component, DestroyRef, inject } from '@angular/core';
import { ZardCardComponent } from '@ui/card/card.component';
import { AuthComponent, SignInForm } from '@core/auth/auth.component';
import { FormGroup } from '@angular/forms';
import { AuthenticationError, Errors, NetworkError } from '@core/models/errors.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signin',
  imports: [ZardCardComponent, AuthComponent],
  templateUrl: './signin.component.html',
  styles: ``,
})
export default class SigninComponent {
  errors: string[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  handleSignIn(data: FormGroup<SignInForm>) {
    this.userService.login(data.getRawValue()).subscribe({
      next: ({ user, token }) => {
        this.router.navigate(['/profile']);
      },
      error: error => {
        if (error instanceof AuthenticationError) {
          this.errors.push(error.message);
        } else if (error instanceof NetworkError) {
          this.errors.push('Network issue. Please check your connection.');
        }
      },
    });
  }
}
