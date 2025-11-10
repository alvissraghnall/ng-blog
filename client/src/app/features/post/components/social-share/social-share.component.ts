import { Component } from '@angular/core';
import { ZardAvatarComponent } from '@ui/avatar/avatar.component';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardDividerComponent } from '@ui/divider/divider.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { Github, Facebook, Twitter, AtSign, Linkedin, Link, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-social-share',
  imports: [ZardButtonComponent, ZardDividerComponent, ZardIconComponent],
  template: `
    <div class="mt-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <z-divider class="absolute left-0 right-0" />
      <p class="text-sm font-semibold text-neutral-light dark:text-neutral-dark z-10">Share this post<></p>
      <div class="flex items-center gap-2 z-10">
        <a
          z-button
          variant="outline"
          size="icon"
          aria-label="Share on Facebook"
          class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors"
          href="#"
          aria-label="Facebook"
        >
          <z-icon [zType]="facebookIcon" zSize="xl"></z-icon>
        </a>
        <a
          z-button
          variant="outline"
          size="icon"
          aria-label="Share on Twitter"
          class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors"
          href="#"
          aria-label="Twitter"
        >
          <z-icon [zType]="twitterIcon" zSize="xl"></z-icon>
        </a>
        <a
          z-button
          variant="outline"
          size="icon"
          aria-label="Share on LinkedIn"
          class="text-text-muted-light dark:text-text-muted-dark hover:text-primary-custom transition-colors"
          href="#"
          aria-label="LinkedIn"
        >
          <z-icon [zType]="linkedInIcon" zSize="xl"></z-icon>
        </a>

        <z-button variant="outline" size="icon" aria-label="Copy link">
          <z-icon [zType]="linkIcon" zSize="xl"></z-icon>
        </z-button>
      </div>
      <z-divider class="absolute left-0 right-0" />
    </div>
  `,
  styles: ``,
})
export class SocialShareComponent {
  facebookIcon: LucideIconData = Facebook;
  twitterIcon: LucideIconData = Twitter;
  linkedInIcon: LucideIconData = Linkedin;
  linkIcon: LucideIconData = Link;
}
