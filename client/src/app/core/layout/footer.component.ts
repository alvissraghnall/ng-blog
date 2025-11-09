import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { Github, Facebook, Twitter, AtSign, type LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, ZardIconComponent],
})
export class FooterComponent {
  today: number = Date.now();

  githubIcon: LucideIconData = Github;
  facebookIcon: LucideIconData = Facebook;
  twitterIcon: LucideIconData = Twitter;
  atSignIcon: LucideIconData = AtSign;
}
