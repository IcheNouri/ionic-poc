import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivateStep} from 'app/authentication/activate/activate-step.enum';
import {ActivateService} from 'app/authentication/activate/activate.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface ActivateStepperStep {
  activateStep: ActivateStep;
  titleTranslateKey: string;
  status: 'todo' | 'inProgress' | 'done';
}

@Component({
  selector: 'myp-activate-stepper',
  templateUrl: './activate-stepper.component.html',
  styleUrls: ['./activate-stepper.component.scss'],
})
export class ActivateStepperComponent implements OnInit, OnDestroy {
  steps: ActivateStepperStep[] = [
    {
      activateStep: ActivateStep.IDENTITY,
      titleTranslateKey: 'authentication.activate.identity.stepper',
      status: 'inProgress',
    },
    {
      activateStep: ActivateStep.EMAIL,
      titleTranslateKey: 'authentication.activate.email.stepper',
      status: 'todo',
    },
    {
      activateStep: ActivateStep.PASSWORD,
      titleTranslateKey: 'authentication.activate.password.stepper',
      status: 'todo',
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(private activateService: ActivateService) {}

  ngOnInit(): void {
    this.activateService
      .getCurrentStep()
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => this.updateStepStatuses(step));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateStepStatuses(currentStep: ActivateStep): void {
    this.steps.forEach(step => (step.status = 'todo'));
    const currentIndex = this.steps.findIndex(step => step.activateStep === currentStep);
    if (currentIndex > 0) {
      for (let i = 0; i < currentIndex; i++) {
        this.steps[i].status = 'done';
      }
    }
    if (currentIndex !== -1) {
      this.steps[currentIndex].status = 'inProgress';
    }
  }
}
