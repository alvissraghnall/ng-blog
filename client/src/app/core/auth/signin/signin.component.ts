import { Component, DestroyRef, inject } from '@angular/core';
import { ZardCardComponent } from '@ui/card/card.component';
import { AuthComponent } from '@core/auth/auth.component';
import { FormGroup } from '@angular/forms';
import { Errors } from '@core/models/errors.model';
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
  errors: Errors = { errors: {} };
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  handleSignIn(data: FormGroup) {
    let observable = this.userService.login(data.value satisfies { username: string; password: string });

    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => void this.router.navigate(['/', 'profile']),
      error: err => {
        this.errors = err;
      },
    });
  }
}
