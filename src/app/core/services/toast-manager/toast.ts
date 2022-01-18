import { ToastClass } from './toast-class.enum';

export interface Toast {
  id?: number;
  message?: string;
  translationKey?: string;
  translationParams?: any;
  class?: ToastClass;
  timeout?: number;
  remove?: () => void;
}
