import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Toast} from '../services/toast-manager/toast';
import {ToastManagerService} from '../services/toast-manager/toast-manager.service';
import {ToastClass} from '../services/toast-manager/toast-class.enum';
import {translationNotFoundMessage} from '../../shared/config/translation.config';

@Component({
  selector: 'myp-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  public toasts: Toast[] = [];

  private destroy$ = new Subject<void>();

  constructor(private toastManager: ToastManagerService) {}

  ngOnInit(): void {
    this.toastManager
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => (this.toasts = toasts));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isToastAutoHide(toast: Toast): boolean {
    return toast.timeout !== undefined && toast.timeout > 0;
  }

  getToastClass(toast: Toast): string {
    return toast.class ?? ToastClass.INFO;
  }

  getToastDelay(toast: Toast): number {
    return toast.timeout ?? 3000;
  }

  getToastTranslationKey(toast: Toast): string {
    return toast.translationKey ?? translationNotFoundMessage;
  }

  isToastTranslatable(toast: Toast): boolean {
    return toast.translationKey !== undefined;
  }

  removeToast(toast: Toast): void {
    if (toast.remove) {
      toast.remove();
    }
  }
}
