import { Component } from '@angular/core';
import { HeaderComponent } from './core/layout/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layout/footer.component';
import { TopNavBar } from '@components/top-nav-bar/top-nav-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TopNavBar],
})
export class AppComponent {}
