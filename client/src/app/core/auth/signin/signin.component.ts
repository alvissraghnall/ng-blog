import { Component } from '@angular/core';
import { ZardCardComponent } from '@ui/card/card.component';
import { AuthComponent } from '@core/auth/auth.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signin',
  imports: [ZardCardComponent, AuthComponent],
  templateUrl: './signin.component.html',
  styles: ``,
})
export default class SigninComponent {
  handleSignIn(data: FormGroup) {}
}
