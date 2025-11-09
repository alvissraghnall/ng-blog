import { Component } from '@angular/core';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ToggleThemeComponent } from '@components/toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-top-nav-bar',
  imports: [ZardButtonComponent, ToggleThemeComponent],
  template: `
    <header class="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          class="flex items-center justify-between h-16 md:h-20 border-b border-border-light dark:border-border-dark"
        >
          <a class="flex items-center gap-3 text-text-light dark:text-text-dark" href="#">
            <span class="material-symbols-outlined text-primary text-2xl">draw</span>
            <h2 class="font-display text-2xl font-bold">shareWithLouis()</h2>
          </a>

          <nav class="hidden md:flex flex-1 justify-center items-center gap-8">
            <a
              class="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              >Home</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              >Blog</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              >About</a
            >
            <a
              class="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              >Contribute</a
            >
          </nav>

          <app-toggle-theme></app-toggle-theme>

          <div class="flex items-center gap-4">
            <button z-button>Subscribe</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class TopNavBar {}
