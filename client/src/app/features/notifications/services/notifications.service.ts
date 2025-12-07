import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Notification } from '@/gql-types';
import { NetworkError, AuthenticationError } from '@core/models/errors.model';

import { getNotifications, getUnreadNotificationsCount } from '@graphql/queries';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@graphql/mutations';
import { onNotificationAdded } from '@graphql/subscriptions';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnDestroy {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private realtimeSubscription: Subscription | null = null;

  constructor(private readonly apollo: Apollo) {}

  initialize(): void {
    this.fetchInitialState();
    this.subscribeToRealtimeUpdates();
  }

  clearState(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
      this.realtimeSubscription = null;
    }
  }

  ngOnDestroy(): void {
    this.clearState();
  }

  private subscribeToRealtimeUpdates(): void {
    if (this.realtimeSubscription) return;

    this.realtimeSubscription = this.apollo
      .subscribe({
        query: onNotificationAdded,
      })
      .subscribe({
        next: (result: any) => {
          const newNotification = result.data?.notificationAdded;
          if (newNotification) {
            this.handleIncomingNotification(newNotification);
          }
        },
        error: err => console.error('SSE Subscription Error: ', err),
      });
  }

  private handleIncomingNotification(notification: Notification): void {
    const currentList = this.notificationsSubject.value;

    if (!currentList.find(n => n.id === notification.id)) {
      this.notificationsSubject.next([notification, ...currentList]);

      const currentCount = this.unreadCountSubject.value;
      this.unreadCountSubject.next(currentCount + 1);
    }
  }

  private fetchInitialState(): void {
    this.apollo
      .query({
        query: getNotifications,
        variables: { limit: 20, offset: 0 },
        fetchPolicy: 'network-only',
      })
      .pipe(map((res: any) => res.data.notifications || []))
      .subscribe(notifications => {
        this.notificationsSubject.next(notifications);
      });

    this.apollo
      .query({
        query: getUnreadNotificationsCount,
        fetchPolicy: 'network-only',
      })
      .pipe(map((res: any) => res.data.unreadNotificationsCount || 0))
      .subscribe(count => {
        this.unreadCountSubject.next(count);
      });
  }

  loadMore(limit = 20, offset = 20): Observable<Notification[]> {
    return this.apollo
      .query({
        query: getNotifications,
        variables: { limit, offset },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result: any) => {
          const more = result.data.notifications || [];
          const current = this.notificationsSubject.value;
          this.notificationsSubject.next([...current, ...more]);

          return more;
        }),
        catchError(this.handleError),
      );
  }

  markAsRead(id: string): Observable<Notification> {
    this.optimisticReadUpdate(id);

    return this.apollo
      .mutate({
        mutation: markNotificationAsRead,
        variables: { id },
      })
      .pipe(
        map((result: any) => result.data.markNotificationAsRead),
        catchError(error => {
          return this.handleError(error);
        }),
      );
  }

  markAllAsRead(): Observable<boolean> {
    const current = this.notificationsSubject.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated as Notification[]);
    this.unreadCountSubject.next(0);

    return this.apollo
      .mutate({
        mutation: markAllNotificationsAsRead,
      })
      .pipe(
        map((res: any) => !!res.data.markAllNotificationsAsRead),
        catchError(this.handleError),
      );
  }

  // delete(id: string): Observable<boolean> {
  //   const current = this.notificationsSubject.value;
  //   const target = current.find(n => n.id === id);

  //   if (target && !target.read) {
  //     this.decrementCount();
  //   }

  //   this.notificationsSubject.next(current.filter(n => n.id !== id));

  //   return this.apollo
  //     .mutate({
  //       mutation: deleteNotification,
  //       variables: { id },
  //     })
  //     .pipe(
  //       map((res: any) => !!res.data.deleteNotification),
  //       catchError(this.handleError),
  //     );
  // }

  private optimisticReadUpdate(id: string): void {
    const current = this.notificationsSubject.value;
    const index = current.findIndex(n => n.id === id);

    if (index !== -1 && !current[index].read) {
      const updatedList = [...current];
      updatedList[index] = { ...updatedList[index], read: true };

      this.notificationsSubject.next(updatedList as Notification[]);
      this.decrementCount();
    }
  }

  private decrementCount(): void {
    const count = this.unreadCountSubject.value;
    if (count > 0) this.unreadCountSubject.next(count - 1);
  }

  private handleError(error: any) {
    if (error.message?.includes('authentication')) {
      return throwError(() => new AuthenticationError('Please login.'));
    }
    return throwError(() => new NetworkError('Request failed'));
  }
}
