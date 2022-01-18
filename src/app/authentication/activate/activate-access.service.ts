import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ActivateStep } from 'app/authentication/activate/activate-step.enum';
import { ActivateService } from 'app/authentication/activate/activate.service';

@Injectable({ providedIn: 'root' })
export class ActivateAccessService implements CanActivate {
  private currentStep = ActivateStep.CODE;

  constructor(private activateService: ActivateService, private router: Router) {
    this.activateService.getCurrentStep().subscribe(currentStep => (this.currentStep = currentStep));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    switch (state.url) {
      case '/activate/code':
        return true;
      case '/activate/identity':
        return this.allowAccessIf(this.currentStep !== ActivateStep.CODE);
      case '/activate/email':
        return this.allowAccessIf(this.currentStep === ActivateStep.EMAIL || this.currentStep === ActivateStep.PASSWORD);
      case '/activate/password':
        return this.allowAccessIf(this.currentStep === ActivateStep.PASSWORD);
      default:
        return this.allowAccessIf(state.url.startsWith('/activate/identity') && !!state.root.queryParams.key);
    }
  }

  private allowAccessIf(isAccessAllowed: boolean): boolean {
    if (!isAccessAllowed) {
      this.router.navigateByUrl('');
    }
    return isAccessAllowed;
  }
}
