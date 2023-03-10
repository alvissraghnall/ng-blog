import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor() { }

  showToast (message: string, duration: number = 4000) {
    const progressStep = 100 / (duration / 100);
  }
}
