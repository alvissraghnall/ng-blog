import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { PostMenuComponent } from './post-menu/post-menu.component';
import { ToastComponent } from './toast/toast.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
    PostMenuComponent,
    ToastComponent,
    FileUploadComponent,
    PostCommentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports:  [
    NavbarComponent,
    FooterComponent,
    LayoutComponent,
    PostMenuComponent,
    FileUploadComponent
  ],
})
export class ComponentsModule { }
