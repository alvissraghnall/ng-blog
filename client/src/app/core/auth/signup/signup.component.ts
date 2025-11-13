import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ZardDividerComponent } from '@ui/divider/divider.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { AuthComponent } from '../auth.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthenticationError, Errors, NetworkError } from '@core/models/errors.model';

@Component({
  selector: 'app-signup',
  imports: [ZardDividerComponent, ZardIconComponent, AuthComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export default class SignupComponent {
  errors: string[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  handleSignUp(data: FormGroup) {
    this.userService
      .register(data.value satisfies { username: string; password: string; email: string; confirmPassword: string })
      .subscribe({
        next: ({}) => {
          this.router.navigate(['/login']);
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
