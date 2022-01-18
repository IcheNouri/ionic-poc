import {Component, OnInit} from '@angular/core';
import {NavbarMode} from './core/navbar/model/navbar-mode.enum';
import {ActivationEnd, NavigationError, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  navbarInducedPadding = '0px';
  navbarMode?: NavbarMode = NavbarMode.SIMPLE;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.navbarMode = event.snapshot.data.navbarMode ?? NavbarMode.SIMPLE;
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });
  }
}
