import { Component, signal } from '@angular/core';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ToggleThemeComponent } from '@components/toggle-theme/toggle-theme.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { Menu, X, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-top-nav-bar',
  imports: [ZardButtonComponent, ToggleThemeComponent, ZardIconComponent],
  template: `
    <header class="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 md:h-20">
          <a class="flex items-center gap-3 text-text-light dark:text-text-dark" href="#">
            <span class="material-symbols-outlined text-primary-custom text-2xl">draw</span>
            <h2 class="font-display text-xl md:text-2xl font-bold">shareWithLouis()</h2>
          </a>

          <nav class="hidden md:flex flex-1 justify-center items-center gap-8">
            <a
              class="text-text-light dark:text-text-dark hover:text-primary-custom transition-colors text-sm font-medium"
              href="#"
            >Home</a>
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              href="#"
            >Blog</a>
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              href="#"
            >About</a>
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors text-sm font-medium"
              href="#"
            >Contribute</a>
          </nav>

          <div class="hidden md:flex items-center gap-4">
            <app-toggle-theme></app-toggle-theme>
            <button z-button>Subscribe</button>
          </div>

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

        @if (mobileMenuOpen()) {
          <div class="md:hidden border-t border-border-light dark:border-border-dark">
            <nav class="flex flex-col py-4 space-y-1">
              <a
                class="px-4 py-3 text-text-light dark:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
              >Home</a>
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
              >Blog</a>
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
              >About</a>
              <a
                class="px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark hover:text-primary-custom transition-colors text-base font-medium"
                href="#"
                (click)="closeMobileMenu()"
              >Contribute</a>
              <div class="px-4 pt-4 border-t border-border-light dark:border-border-dark">
                <button z-button class="w-full">Subscribe</button>
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
  mobileMenuOpen = signal(false);
  menuIcon: LucideIconData = Menu;
  closeIcon: LucideIconData = X;

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
