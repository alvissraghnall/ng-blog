import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { PostMenuComponent } from './post-menu/post-menu.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
    PostMenuComponent
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
