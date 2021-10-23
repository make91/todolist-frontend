import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, EMPTY } from 'rxjs';
import { switchMap, concatMap, catchError, shareReplay } from 'rxjs/operators';

/**
 * Handles API requests
 *
 * Updates data at regular intervals on its own
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  /** API url */
  private readonly url = '/todos';
  /** Subject for poll requests, data is updated immediately when requested */
  private readonly poll = new BehaviorSubject('');
  /** Interval in ms for updating data */
  private readonly UPDATE_INTERVAL = 10000;

  constructor(
    private readonly http: HttpClient,
  ) {}

  getTodos(): Observable<any> {
    return this.poll.pipe(
      switchMap(() => timer(0, this.UPDATE_INTERVAL).pipe(
          concatMap(() => this.http.get(this.url).pipe(
            catchError(this.handleError),
          ),
        )),
      ),
      // Prevent multiple http requests, new subscriber gets previous value
      shareReplay(1),
    );
  }

  addTodo(msg: string): Observable<any> {
    const body = { msg };
    return this.http.post(this.url, body).pipe(
      catchError(this.handleError),
    );
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id).pipe(
      catchError(this.handleError),
    );
  }

  updateTodo(id: string, body: any): Observable<any> {
    return this.http.put(this.url + '/' + id, body).pipe(
      catchError(this.handleError),
    );
  }

  refreshData(): void {
    this.poll.next('');
  }

  private handleError(err: Error): Observable<never> {
    console.error(err);
    return EMPTY;
  }
}
