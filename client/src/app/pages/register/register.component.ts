import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  signupForm!: FormGroup;
  
  constructor(private readonly fb: FormBuilder) { }

  onSubmit(form: FormGroup) {
    console.log({
      valid: form.valid,
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
      //avatar
    })
  }
}
