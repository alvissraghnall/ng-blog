import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, type Subject } from 'rxjs';
import { Category } from 'src/app/models/enum/category.enum';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {

  currentUser?: User;
  showMobileMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private prevShowMobileMenu: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  navLinks = [
    Category.FASHION,
    Category.CUISINE,
    Category.TECHNOLOGY,
    Category.DIY,
    Category.LIFESTYLE,
    Category.TRAVEL,
    Category.CINEMA
  ];

  setShowMobileMenu () {
    this.showMobileMenu.next(!this.prevShowMobileMenu);
    this.prevShowMobileMenu = this.showMobileMenu.value;

    console.log(this.prevShowMobileMenu, this.showMobileMenu, this.showMobileMenu.value);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
    
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

}
