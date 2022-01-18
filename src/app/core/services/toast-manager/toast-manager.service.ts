import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Toast } from './toast';
import { ToastClass } from './toast-class.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastManagerService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private toastId = 0;
  private defaultToastProperties = {
    class: ToastClass.INFO,
    timeout: 10000,
  };

  constructor(private sanitizer: DomSanitizer) {}

  clear(): void {
    this.toasts$.next([]);
  }

  get(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  show(toast: Toast): Toast {
    const validToast = this.createValidToast(toast);
    const toasts = this.toasts$.value;
    this.toasts$.next([...toasts, validToast]);
    return validToast;
  }

  showHttpError(err: any): Toast {
    const toast: Toast = {
      message: err?.error?.message,
      translationKey: err?.error?.localizedMessage ?? 'server.unknown',
      translationParams: err?.error?.arguments,
      class: ToastClass.ERROR,
    };
    return this.show(toast);
  }

  private remove(toastId: number): void {
    const toasts = this.toasts$.value;
    const toastIndex = toasts.map(toast => toast.id).indexOf(toastId);
    if (toastIndex >= 0) {
      this.toasts$.next(toasts.filter(toast => toast.id !== toastId));
    }
  }

  private createValidToast(toast: Toast): Toast {
    const id = this.getToastId();
    return {
      id,
      message: this.sanitizer.sanitize(SecurityContext.HTML, toast.message ?? '') ?? '',
      translationKey: toast.translationKey,
      translationParams: toast.translationParams,
      class: toast.class ?? this.defaultToastProperties.class,
      timeout: toast.timeout ?? this.defaultToastProperties.timeout,
      remove: () => this.remove(id),
    };
  }

  private getToastId(): number {
    return this.toastId++;
  }
}
