import { Component, OnInit } from '@angular/core';
import { User } from '@models/User.model';
import { AuthService } from '@services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(updateUserInput: $input) {
      id
      username
      email
      avatar
      bio
    }
  }
`;

@Component({
  selector: 'app-user',
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Account Settings</h1>

      <div *ngIf="!user" class="text-center py-8">
        <p>Loading profile...</p>
      </div>

      <form *ngIf="user" [formGroup]="userForm" (submit)="onSubmit()" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input type="text" formControlName="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Bio</label>
          <textarea formControlName="bio" rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Avatar URL</label>
          <input type="text" formControlName="avatar"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <button type="submit" [disabled]="!userForm.valid || isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class UserComponent implements OnInit {

  user?: User;
  userForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly apollo: Apollo,
    private readonly toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      avatar: [''],
    });

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.userForm.patchValue(currentUser);
    } else {
      this.authService.whoami().subscribe((result: any) => {
        if (result.data?.whoami) {
          this.user = result.data.whoami;
          this.userForm.patchValue(result.data.whoami);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user) return;
    this.isSubmitting = true;

    this.apollo.mutate({
      mutation: UPDATE_USER,
      variables: {
        input: {
          id: this.user.id,
          ...this.userForm.value,
        },
      },
      errorPolicy: 'all',
    }).subscribe((result: any) => {
      this.isSubmitting = false;
      if (result.data?.updateUser) {
        this.authService.setCurrentUser(result.data.updateUser);
        this.toastr.success('Profile updated successfully');
      }
      if (result.errors) {
        this.toastr.error('Failed to update profile');
      }
    });
  }
}
