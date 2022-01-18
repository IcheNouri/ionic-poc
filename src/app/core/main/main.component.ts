import { ChangeDetectorRef, Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ActivationEnd, Event, NavigationEnd, NavigationError, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {NavbarMode} from '../navbar/model/navbar-mode.enum';
import {AccountService} from '../auth/account.service';
import {NavbarService} from '../navbar/navbar.service';
import {NavbarResizeEvent} from '../navbar/model/navbar-event.model';
import * as dayjs from 'dayjs';


@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  navbarMode?: NavbarMode;
  navbarInducedPadding = '0px';
  private renderer: Renderer2;

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    private navbarService: NavbarService,
    private cdf: ChangeDetectorRef,
    rootRenderer: RendererFactory2
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      this.getNavbarModeFromRoute(event);
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });

    this.navbarService.getNavbarEvents().subscribe(event => {
      if (event instanceof NavbarResizeEvent) {
        this.navbarInducedPadding = this.navbarMode === NavbarMode.EXTENDED ? '0' : `${event.height}px`;
        this.cdf.detectChanges();
      }EXTENDED
    });
  }

  private getNavbarModeFromRoute(event: Event): void {
    if (event instanceof ActivationEnd) {
      this.navbarMode = event.snapshot.data.navbarMode ?? NavbarMode.SIMPLE;
    }
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data.pageTitle ?? '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }
}
