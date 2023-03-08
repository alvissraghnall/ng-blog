import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  navLinks = [
    Category.FASHION,
    Category.CUISINE,
    Category.TECHNOLOGY,
    Category.DIY,
    Category.LIFESTYLE,
    Category.TRAVEL,
    Category.CINEMA
  ];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
    
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

}
