import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LoadingState {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({});
  public loading$: Observable<LoadingState> = this.loadingSubject.asObservable();

  setLoading(key: string, isLoading: boolean): void {
    const currentState = this.loadingSubject.value;
    this.loadingSubject.next({
      ...currentState,
      [key]: isLoading,
    });
  }

  start(key: string): void {
    this.setLoading(key, true);
  }

  stop(key: string): void {
    this.setLoading(key, false);
  }

  isLoading(key: string): Observable<boolean> {
    return this.loading$.pipe(map(state => !!state[key]));
  }

  isAnyLoading(): Observable<boolean> {
    return this.loading$.pipe(map(state => Object.values(state).some(loading => loading)));
  }

  getLoadingState(key: string): boolean {
    return !!this.loadingSubject.value[key];
  }

  clear(key: string): void {
    const currentState = this.loadingSubject.value;
    const { [key]: _, ...newState } = currentState;
    this.loadingSubject.next(newState);
  }

  clearAll(): void {
    this.loadingSubject.next({});
  }

  async withLoading<T>(key: string, operation: () => Promise<T>): Promise<T> {
    this.start(key);
    try {
      const result = await operation();
      return result;
    } finally {
      this.stop(key);
    }
  }

  withLoadingObservable<T>(key: string, operation: Observable<T>): Observable<T> {
    this.start(key);
    return new Observable(observer => {
      const subscription = operation.subscribe({
        next: value => observer.next(value),
        error: err => {
          this.stop(key);
          observer.error(err);
        },
        complete: () => {
          this.stop(key);
          observer.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
  }

  getActiveLoadingKeys(): string[] {
    const state = this.loadingSubject.value;
    return Object.keys(state).filter(key => state[key]);
  }

  areAllLoading(...keys: string[]): Observable<boolean> {
    return this.loading$.pipe(map(state => keys.every(key => !!state[key])));
  }

  areSomeLoading(...keys: string[]): Observable<boolean> {
    return this.loading$.pipe(map(state => keys.some(key => !!state[key])));
  }
}
