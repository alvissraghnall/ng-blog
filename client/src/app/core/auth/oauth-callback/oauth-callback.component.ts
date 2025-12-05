import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/auth/services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
      <p class="text-muted-foreground animate-pulse">Completing secure sign in...</p>
    </div>
  `,
})
export default class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit() {
    // 1. Get the provider from the URL path (e.g. 'google' from /oauth/callback/google)
    const provider = this.route.snapshot.paramMap.get('provider') as 'google' | 'github';
    
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!provider || !code) {
      this.handleError('Invalid callback parameters.');
      return;
    }

    this.userService.oauthLogin({ code, provider, redirectUri: `${window.location.origin}/oauth/${provider}/callback` })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/profile'], { replaceUrl: true });
        },
        error: (err) => {
          this.handleError(err.message || 'Authentication failed.');
        }
      });
  }

  private handleError(message: string) {
    this.router.navigate(['/login'], { 
      queryParams: { error: message },
      replaceUrl: true 
    });
  }
}