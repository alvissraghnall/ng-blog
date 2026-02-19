import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Menu, X, LogOut, type LucideIconData } from 'lucide-angular';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ToggleThemeComponent } from '@components/toggle-theme/toggle-theme.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { IfAuthenticatedDirective } from '@core/auth/if-authenticated.directive';
import { UserService } from '@core/auth/services/user.service';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ZardButtonComponent,
    ToggleThemeComponent,
    ZardIconComponent,
    IfAuthenticatedDirective
  ],
  template: `
    <header
      class="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 md:h-20">
          <a class="flex items-center gap-3 text-text-light dark:text-text-dark" routerLink="/">
            <span class="material-symbols-outlined text-primary-custom text-2xl">draw</span>
            <h2 class="font-display text-xl md:text-2xl font-bold">shareWithAlviss()</h2>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex flex-1 justify-center items-center gap-8">
            <a
              class="text-text-light dark:text-text-dark hover:text-primary-custom transition-colors text-sm font-medium"
              routerLink="/"
              >Home</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              routerLink="/blog"
              >Blog</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              routerLink="/about"
              >About</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              routerLink="/contribute"
              >Contribute</a
            >
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-4">
            <app-toggle-theme></app-toggle-theme>

            <!-- STATE: NOT Authenticated -->
            <ng-container *ifAuthenticated="false">
              <a z-button routerLink="/login">Sign in</a>
            </ng-container>

            <!-- STATE: Authenticated -->
            <ng-container *ifAuthenticated="true">
              <div class="flex items-center gap-3 pl-2 border-l border-border-light dark:border-border-dark" *ngIf="currentUser$ | async as user">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-semibold text-text-light dark:text-text-dark">{{ user.username }}</span>
                  <span class="text-[10px] text-muted-foreground">{{ user.email }}</span>
                </div>
                
                <div class="h-9 w-9 rounded-full overflow-hidden border border-border-light dark:border-border-dark bg-muted">
                  <img 
                    [src]="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.username" 
                    alt="User avatar"
                    class="h-full w-full object-cover"
                  >
                </div>

                <button 
                  (click)="logout()" 
                  class="ml-1 p-2 text-text-muted-light hover:text-destructive transition-colors rounded-md hover:bg-muted/50"
                  title="Logout"
                >
                  <z-icon [zType]="logoutIcon" zSize="sm" />
                </button>
              </div>
            </ng-container>
          </div>

          <!-- Mobile Menu Toggle -->
          <div class="flex md:hidden items-center gap-3">
            <app-toggle-theme></app-toggle-theme>
            <button
              (click)="toggleMobileMenu()"
              class="p-2 text-text-light dark:text-text-dark hover:text-primary-custom transition-colors"
              [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
            >
              <z-icon [zType]="mobileMenuOpen() ? closeIcon : menuIcon" zSize="xl" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden border-t border-border-light dark:border-border-dark">
            <nav class="flex flex-col py-4 space-y-1">
              <a
                class="px-4 py-3 text-text-light dark:text-text-dark hover:bg-background hover:text-primary-custom transition-colors text-base font-medium"
                routerLink="/home"
                (click)="closeMobileMenu()"
                >Home</a
              >
              
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-background hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
                >Blog</a
              >
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-background hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
                >About</a
              >
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-background hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
                >Contribute</a>
              
              <div class="px-4 pt-4 border-t border-border-light dark:border-border-dark mt-2">
                <!-- Mobile: Not Authenticated -->
                <ng-container *ifAuthenticated="false">
                  <button z-button class="w-full" routerLink="/auth" (click)="closeMobileMenu()">Sign In</button>
                </ng-container>

                <!-- Mobile: Authenticated -->
                <ng-container *ifAuthenticated="true">
                  <div class="flex items-center gap-3 mb-4" *ngIf="currentUser$ | async as user">
                    <img 
                      [src]="user.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + user.username" 
                      class="h-10 w-10 rounded-full bg-muted"
                    >
                    <div class="flex flex-col">
                      <span class="font-medium">{{ user.username }}</span>
                      <span class="text-xs text-muted-foreground">{{ user.email }}</span>
                    </div>
                  </div>
                  <button z-button zVariant="outline" class="w-full flex items-center justify-center gap-2" (click)="logout()">
                    <z-icon [zType]="logoutIcon" zSize="sm" />
                    Log out
                  </button>
                </ng-container>
              </div>
            </nav>
          </div>
        }
      </div>
    </header>
  `,
  styles: ``,
})
export class TopNavBar {
  private userService = inject(UserService);

  mobileMenuOpen = signal(false);
  currentUser$ = this.userService.currentUser;

  menuIcon: LucideIconData = Menu;
  closeIcon: LucideIconData = X;
  logoutIcon: LucideIconData = LogOut;

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.userService.logout();
    this.closeMobileMenu();
  }
}