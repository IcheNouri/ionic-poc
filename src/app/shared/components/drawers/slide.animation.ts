import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export function slide(direction: 'right' | 'bottom'): AnimationTriggerMetadata {
  const translation = direction === 'right' ? 'translateX' : 'translateY';
  return trigger('slide', [
    transition(':enter', [style({ transform: translation + '(100%)' }), animate('0.25s ease-in', style({ transform: translation + '(0%)' }))]),
    transition(':leave', [animate('0.25s ease-in', style({ transform: translation + '(100%)' }))]),
  ]);
}
