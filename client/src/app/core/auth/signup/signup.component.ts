import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ZardDividerComponent } from '@ui/divider/divider.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { AuthComponent } from '../auth.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Errors } from '@core/models/errors.model';

@Component({
  selector: 'app-signup',
  imports: [ZardDividerComponent, ZardIconComponent, AuthComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export default class SignupComponent {
  errors: Errors = { errors: {} };
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  handleSignUp(data: FormGroup) {
    let observable = this.userService.register(
      data.value as {
        email: string;
        password: string;
        username: string;
        confirmPassword: string;
      },
    );

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/']),
      error: err => {
        this.errors = err;
      },
    });
  }
}
