import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyStorageService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('token', token.replace("Bearer ", "").trim());
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

}
