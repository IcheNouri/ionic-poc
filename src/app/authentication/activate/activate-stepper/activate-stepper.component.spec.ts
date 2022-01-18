import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateStep } from 'app/authentication/activate/activate-step.enum';
import { ActivateStepperComponent } from 'app/authentication/activate/activate-stepper/activate-stepper.component';
import { ActivateService } from 'app/authentication/activate/activate.service';
import { BehaviorSubject } from 'rxjs';

jest.mock('app/authentication/activate/activate.service');

describe('Component Tests', () => {
  describe('ActivateStepperComponent', () => {
    let comp: ActivateStepperComponent;
    let fixture: ComponentFixture<ActivateStepperComponent>;
    let mockActivateService: ActivateService;
    let getStepperStepStatus: (step: ActivateStep) => 'todo' | 'inProgress' | 'done' | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActivateStepperComponent],
        providers: [ActivateService],
      })
        .overrideTemplate(ActivateStepperComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivateStepperComponent);
      comp = fixture.componentInstance;
      mockActivateService = TestBed.inject(ActivateService);

      getStepperStepStatus = step => comp.steps.find(stepperStep => stepperStep.activateStep === step)?.status;
    });

    it('should update the step statuses', () => {
      // GIVEN
      const currentStep$ = new BehaviorSubject<ActivateStep>(ActivateStep.CODE);

      // WHEN
      mockActivateService.getCurrentStep = jest.fn(() => currentStep$.asObservable());
      comp.ngOnInit();

      // THEN
      expect(getStepperStepStatus(ActivateStep.IDENTITY)).toBe('todo');
      expect(getStepperStepStatus(ActivateStep.EMAIL)).toBe('todo');
      expect(getStepperStepStatus(ActivateStep.PASSWORD)).toBe('todo');
      currentStep$.next(ActivateStep.IDENTITY);
      expect(getStepperStepStatus(ActivateStep.IDENTITY)).toBe('inProgress');
      expect(getStepperStepStatus(ActivateStep.EMAIL)).toBe('todo');
      expect(getStepperStepStatus(ActivateStep.PASSWORD)).toBe('todo');
      currentStep$.next(ActivateStep.EMAIL);
      expect(getStepperStepStatus(ActivateStep.IDENTITY)).toBe('done');
      expect(getStepperStepStatus(ActivateStep.EMAIL)).toBe('inProgress');
      expect(getStepperStepStatus(ActivateStep.PASSWORD)).toBe('todo');
      currentStep$.next(ActivateStep.PASSWORD);
      expect(getStepperStepStatus(ActivateStep.IDENTITY)).toBe('done');
      expect(getStepperStepStatus(ActivateStep.EMAIL)).toBe('done');
      expect(getStepperStepStatus(ActivateStep.PASSWORD)).toBe('inProgress');
    });
  });
});
