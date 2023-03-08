import { Injectable } from '@angular/core';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  setCurrentUser(currentUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  getCurrentUser() {
    const currUser = localStorage.getItem('currentUser');
    return currUser !== null ? JSON.parse(currUser) : null;
  }

  removeCurrentUser() {
    localStorage.removeItem('currentUser');
  }
}
