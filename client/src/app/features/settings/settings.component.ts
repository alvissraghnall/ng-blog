import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import type { User } from '@/gql-types';
import { UserService } from '../../core/auth/services/user.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ZardFormModule } from '@ui/form/form.module';
import { ZardInputDirective } from '@ui/input/input.directive';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardDividerComponent } from '@ui/divider/divider.component';

interface SettingsForm {
  avatar: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html',
  imports: [
    ReactiveFormsModule,
    ZardFormModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardDividerComponent,
  ],
})
export default class SettingsComponent implements OnInit {
  user = signal<User | null>(null);
  settingsForm = new FormGroup<SettingsForm>({
    avatar: new FormControl('', { nonNullable: true }),
    username: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  errorMessage = signal<string | null>(null);
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUserValue();
    if (currentUser) {
      this.user.set(currentUser);
      this.settingsForm.patchValue({
        avatar: currentUser.avatar ?? '',
        username: currentUser.username,
        bio: currentUser.bio ?? '',
        email: currentUser.email,
        password: '',
      });
    }
  }

  get isOAuthUser(): boolean {
    return !!this.user()?.oauthProvider;
  }

  logout(): void {
    this.userService.logout();
  }

  submitForm() {
    this.isSubmitting = true;

    const values = this.settingsForm.value;
    this.userService
      .update({
        avatar: values.avatar ?? undefined,
        bio: values.bio ?? undefined,
        password: values.password || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: user => void this.router.navigate(['/profile/', user.username]),
        error: err => {
          this.errorMessage.set(err.message || 'An error occurred');
          this.isSubmitting = false;
        },
      });
  }
}
