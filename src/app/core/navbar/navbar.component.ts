import {animate, state, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {takeUntil} from 'rxjs/operators';
import {AbstractAccountComponent} from '../auth/abstract-account.component';
import {NavbarMode} from './model/navbar-mode.enum';
// import {LoginService} from '../../authentication/login/login.service';
import {AccountService} from '../auth/account.service';
import {NavbarService} from './navbar.service';
import {BottomDrawerEvent, NavbarResizeEvent} from './model/navbar-event.model';

@Component({
  selector: 'myp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fabslideup', [
      state('down', style({ transform: 'translateY(0)' })),
      state('up', style({ transform: 'translateY(-61.11px)' })),
      transition('down <=> up', animate('0.25s ease-in')),
    ]),
  ],
})
export class NavbarComponent extends AbstractAccountComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() mode?: NavbarMode;
  @ViewChild('navbarContainer') navbarContainer?: ElementRef<HTMLDivElement>;

  NavbarModeEnum = NavbarMode;
  isNotificationDrawerOpen = false;
  hasNewNotifications = true;
  isWindowScrolled = false;
  fabPosition: 'down' | 'up' = 'down';
  isUserLoggedIn = false;

  private resizeObserver = new ResizeObserver(entries => this.notifyNavbarResize(entries));

  constructor(
  //  private loginService: LoginService,
    private accountService: AccountService,
    private router: Router,
    private navbarService: NavbarService,
    private cdr: ChangeDetectorRef
  ) {
    super(accountService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.navbarService
      .getNavbarEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof BottomDrawerEvent) {
          this.fabPosition = event.isOpen ? 'up' : 'down';
          this.cdr.detectChanges();
        }
      });
    this.accountService
      .identity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.isUserLoggedIn = !!account));
  }

  ngAfterViewInit(): void {
    this.listenToNavbarResize();
  }

  @HostListener('window:scroll', ['$event'])
  updateScroll(): void {
    this.isWindowScrolled = window.pageYOffset !== 0;
  }

  get firstName(): string {
    return this.account?.firstName ?? '';
  }

  get lastName(): string {
    return this.account?.lastName ?? '';
  }

  private listenToNavbarResize(): void {
    if (this.navbarContainer?.nativeElement) {
      this.resizeObserver.observe(this.navbarContainer.nativeElement);
    }
  }

  private notifyNavbarResize(entries: ResizeObserverEntry[]): void {
    this.navbarService.sendNavbarEvent(new NavbarResizeEvent(entries[0].contentRect.height));
  }
}
