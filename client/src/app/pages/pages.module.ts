import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { CreateComponent } from './create/create.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from "@ng-icons/heroicons/outline"
import { ComponentsModule } from '../components/components.module';


@NgModule({
  declarations: [
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    CreateComponent,
    PostDetailsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIconsModule.withIcons({
      heroPencilSquare,
      heroTrash
    }),
    ComponentsModule
  ],
  exports: [
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    CreateComponent,
    PostDetailsComponent,
  ],
})
export class PagesModule { }
