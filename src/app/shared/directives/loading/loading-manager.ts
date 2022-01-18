import { BehaviorSubject, Observable } from 'rxjs';

export class LoadingManager {
  private isLoading$: BehaviorSubject<boolean>;

  constructor(isLoading = false) {
    this.isLoading$ = new BehaviorSubject<boolean>(isLoading);
  }

  public get isLoading(): boolean {
    return this.isLoading$.value;
  }

  public loading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  public start(): void {
    this.isLoading$.next(true);
  }

  public stop(): void {
    this.isLoading$.next(false);
  }
}
