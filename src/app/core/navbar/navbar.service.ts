import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {NavbarEvent} from './model/navbar-event.model';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private navbarEvents$ = new BehaviorSubject<NavbarEvent>({ isOpen: false });

  public getNavbarEvents(): Observable<NavbarEvent> {
    return this.navbarEvents$.asObservable();
  }

  public sendNavbarEvent(event: NavbarEvent): void {
    this.navbarEvents$.next(event);
  }
}
