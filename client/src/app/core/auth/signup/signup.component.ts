import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ZardDividerComponent } from '@ui/divider/divider.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-signup',
  imports: [ZardDividerComponent, ZardIconComponent, AuthComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export default class SignupComponent {
  handleSignUp(data: FormGroup) {}
}
