import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { PostMenuComponent } from './post-menu/post-menu.component';
import { ToastComponent } from './toast/toast.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
    PostMenuComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:  [
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
    PostMenuComponent
  ],
})
export class ComponentsModule { }
