import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async canActivateChild(
    childRoute: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> 
  {
    if (await this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigateByUrl("/");
    return false;;
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> 
  {
    if (await this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigateByUrl("/");
    return false;
  }
  
}
