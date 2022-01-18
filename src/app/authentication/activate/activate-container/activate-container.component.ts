import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ActivateStep} from 'app/authentication/activate/activate-step.enum';
import {ActivateService} from 'app/authentication/activate/activate.service';
import {LoadingManager} from 'app/shared/directives/loading/loading-manager';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'myp-activate-container',
  templateUrl: './activate-container.component.html',
  styleUrls: ['./activate-container.component.scss'],
})
export class ActivateContainerComponent implements OnInit, OnDestroy {
  @Input() loadingManager = new LoadingManager();

  ActivateStepEnum = ActivateStep;
  currentStep = ActivateStep.CODE;
  isLandingOnIdentityStep = false;

  private destroy$ = new Subject<void>();

  constructor(private activateService: ActivateService, private router: Router) {}

  ngOnInit(): void {
    this.activateService
      .getCurrentStep()
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => (this.currentStep = step));
    this.activateService
      .isLandingOnIdentityStep()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLandingOnIdentityStep => (this.isLandingOnIdentityStep = isLandingOnIdentityStep));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
