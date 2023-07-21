import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, type Subject } from 'rxjs';
import { Category } from 'src/app/models/enum/category.enum';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    ` 
      .sticky-head {
        @apply w-full sticky top-0 left-0 leading-8 z-50 shadow-md shadow-[#ddd] bg-[#fff];
      }
    `
]
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChild('header') headerRef?: ElementRef<HTMLElement>;
  currentUser?: User;
  showMobileMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private prevShowMobileMenu: boolean = false;
  private prevScrollPos = new BehaviorSubject<number>(window.scrollY);

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


  stickyHeader () {
//    const prevScrollPos = ref(window.scrollY);
    console.log("wow");

    window.addEventListener("scroll", () => {
      const currScrollPos = window.scrollY;

      if(this.prevScrollPos.value > currScrollPos) {
        this.headerRef?.nativeElement.classList.remove("-top-[4rem]");
        this.headerRef?.nativeElement.classList.add("sticky-head");
      } else {
        this.headerRef?.nativeElement.classList.remove("sticky-head");
        this.headerRef?.nativeElement.classList.add("-top-[4rem]");
      }
      console.log(this.headerRef);
      this.prevScrollPos.next(currScrollPos);
    });
  }

  ngAfterViewInit() {
    this.stickyHeader();
  }

}
