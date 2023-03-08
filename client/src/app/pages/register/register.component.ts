import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { SimpleModalService } from 'ngx-simple-modal';
import { CREATE_USER } from 'src/app/graphql/auth.queries';
import { ModalComponent } from 'src/app/modal/modal/modal.component';
import { CreateUserInput } from 'src/app/models/inputs/create-user.input';
import { AuthService } from 'src/app/services/auth.service';
import { GenerateRandomAvatarService } from 'src/app/services/generate-random-avatar.service';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  signupForm!: FormGroup;
  private createUserInput!: CreateUserInput;
  isSubmitting: boolean = false;
  displayModal: boolean = false;
  responseData: any;
  requestErrors: any;
  selectedAvatar: string | null = null;
  avatars = this.generateRandomAvatarService.generateAvatars();
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly apollo: Apollo,
    protected readonly authService: AuthService,
    // protected readonly modalService: ModalService<ModalComponent<RegisterComponent>>,
    private readonly router: Router,
    private readonly generateRandomAvatarService: GenerateRandomAvatarService
  ) { }

  onSubmit(form: FormGroup) {
    console.log({
      valid: form.valid,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      username: form.value.username
    });
    this.createUserInput = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      avatar: this.selectedAvatar
    }

    this.authService.signup(
      this.createUserInput,
      this.isSubmitting
    ).subscribe(
      (result: any) => {
        console.log(result);
        
        this.requestErrors = result.errors;
        this.isSubmitting = result.loading;
        this.responseData = result.data?.signup;

        if(this.requestErrors) {console.log(this.requestErrors); this.showModal();}

        if(this.responseData) {
          this.router.navigateByUrl("/login");
        }
      }
    );

    // console.log(form, 47);
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
      // avatar: ["", [Validators.required, Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)]]
    });
    
    this.signupForm.addValidators(
      this.createCompareValidator(
        this.signupForm.get("password")!,
        this.signupForm.get("confirmPassword")!
      )
    );

    // this.signupForm.errors/
  }

  showModal(): void {
    this.displayModal = true;
    console.log("in show");
    

    setTimeout(() => {
      this.displayModal = false;
    }, 18000);
  }

  closeModal() {
    this.displayModal = false;
  }

  createCompareValidator (pwd: AbstractControl, conPwd: AbstractControl) {
    return () => pwd.value !== conPwd.value ? { match_error: "Password and confirm password fields must match." } : null;
  }

  refreshAvatars () {
    this.avatars = this.generateRandomAvatarService.generateAvatars();
  }

  chooseAvatar ($event: Event) {
    this.selectedAvatar = ($event.target as HTMLImageElement).src;
  }
}
