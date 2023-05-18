import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CreateComponent } from './pages/create/create.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
  path: "register",
  component: RegisterComponent
}, {
  path: "login",
  component: LoginComponent
}, 
{
  path: '',
  component: LayoutComponent,
  pathMatch: "prefix",
  // redirectTo: 'home',
  // pathMatch: 'full',
  children: [
    {
      path: "",
      redirectTo: "/home",
      pathMatch: "full"
    },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'create',
      component: CreateComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'post/:id',
      component: PostDetailsComponent
    },
    {
      path: 'user',
      component: UserComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'profile/:id',
      component: ProfileComponent,
    }
  ]
}, {
  path: "**",
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
