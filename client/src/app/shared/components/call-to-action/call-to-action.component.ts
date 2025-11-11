import { Component } from '@angular/core';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';

@Component({
  selector: 'app-call-to-action',
  imports: [ZardButtonComponent, ZardInputDirective],
  template: `
    <section class="bg-background py-12 md:py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col items-center justify-center gap-6 text-center">
          <h2 class="text-text-light dark:text-text-dark text-3xl md:text-4xl font-display font-bold leading-tight">
            Join the Conversation
          </h2>
          <p class="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal max-w-xl">
            Receive our latest articles and exclusive content directly in your inbox. No spam, ever.
          </p>

          <div class="w-full max-w-md">
            <div class="flex w-full items-center space-x-2">
              <label for="email-cta" class="sr-only">Email</label>
              <input z-input id="email-cta" type="email" placeholder="Enter your email address" class="flex-1" />
              <button z-button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class CallToActionComponent {}
