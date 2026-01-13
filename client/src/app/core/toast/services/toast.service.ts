import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  private dismissSubject = new Subject<string>();

  public toasts$: Observable<Toast> = this.toastSubject.asObservable();
  public dismiss$: Observable<string> = this.dismissSubject.asObservable();

  private readonly DEFAULT_DURATION = 5000;

  private toastCounter = 0;

  success(message: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      duration: duration || this.DEFAULT_DURATION,
    });
  }

  error(message: string, duration?: number): void {
    this.show({
      type: 'error',
      message,
      duration: duration || this.DEFAULT_DURATION * 2,
    });
  }

  warning(message: string, duration?: number): void {
    this.show({
      type: 'warning',
      message,
      duration: duration || this.DEFAULT_DURATION,
    });
  }

  info(message: string, duration?: number): void {
    this.show({
      type: 'info',
      message,
      duration: duration || this.DEFAULT_DURATION,
    });
  }

  show(config: Omit<Toast, 'id'>): void {
    const toast: Toast = {
      id: this.generateId(),
      type: config.type,
      message: config.message,
      duration: config.duration || this.DEFAULT_DURATION,
      dismissible: config.dismissible !== false,
    };

    this.toastSubject.next(toast);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);
    }
  }

  dismiss(toastId: string): void {
    this.dismissSubject.next(toastId);
  }

  showError(error: Error | any): void {
    const message = error?.message || 'An unexpected error occurred.';
    this.error(message);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${++this.toastCounter}`;
  }
}
