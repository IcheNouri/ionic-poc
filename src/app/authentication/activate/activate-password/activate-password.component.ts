import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivateService } from 'app/authentication/activate/activate.service';
import { LoadingManager } from 'app/shared/directives/loading/loading-manager';
import { ToastManagerService } from 'app/core/services/toast-manager/toast-manager.service';

@Component({
  selector: 'myp-activate-password',
  templateUrl: './activate-password.component.html',
  styleUrls: ['./activate-password.component.scss'],
})
export class ActivatePasswordComponent {
  loadingManager = new LoadingManager();

  constructor(private activateService: ActivateService, private fb: FormBuilder, private router: Router, public toastService: ToastManagerService) {}

  submitPassword(password: string): void {
    this.loadingManager.start();
    this.activateService.verifyPassword(password).subscribe(
      () => {
        this.loadingManager.stop();
        this.router.navigate(['/']);
      },
      err => {
        console.error(err);
        this.toastService.showHttpError(err);
        this.loadingManager.stop();
      }
    );
  }

  back(): void {
    this.activateService.goBack();
  }
}
