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
import { 
  heroPencilSquare, 
  heroTrash,
} from "@ng-icons/heroicons/outline";
import { ComponentsModule } from '../components/components.module';
import { QuillModule } from 'ngx-quill'

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
      heroTrash,
    }),
    ComponentsModule,
    QuillModule.forRoot()
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



// https://api.cloudinary.com/v1_1/${cloudName}/upload
// curl https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload -X POST --data 'file=<FILE>&timestamp=<TIMESTAMP>&api_key=<API_KEY>&signature=<SIGNATURE>'
// curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST -F 'file=@/path/to/sample.jpg' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'