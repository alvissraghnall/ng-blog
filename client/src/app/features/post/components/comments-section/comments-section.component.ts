import { Component } from '@angular/core';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';

@Component({
  selector: 'app-comments-section',
  imports: [ZardInputDirective, ZardButtonComponent],
  template: `
    <section class="mt-16">
      <h2 class="text-2xl font-bold text-neutral-light dark:text-neutral-dark mb-6">Comments</h2>

      <div class="mb-8">
        <textarea z-input placeholder="Write your comment here..." rows="4" class="w-full"></textarea>
        <z-button class="mt-4">Submit Comment</z-button>
      </div>

      <p class="text-muted-foreground text-sm">No comments yet. Be the first to share your thoughts!</p>
    </section>
  `,
  styles: ``,
})
export class CommentsSectionComponent {}
