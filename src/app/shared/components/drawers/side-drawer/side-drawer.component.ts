import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {slide} from '../slide.animation';

@Component({
  selector: 'myp-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.scss'],
  animations: [
    slide('right'),
    trigger('fade', [
      transition(':enter', [style({ opacity: '0' }), animate('0.25s ease-in', style({ opacity: '1' }))]),
      transition(':leave', [animate('0.25s ease-in', style({ opacity: '0' }))]),
    ]),
  ],
})
export class SideDrawerComponent implements OnChanges {
  @Input() titleKey = '';
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (changes.isOpen !== undefined) {
      if (changes.isOpen.currentValue) {
        document.body.style['overflow-y' as any] = 'hidden';
      } else {
        document.body.style['overflow-y' as any] = 'visible';
      }
    }
  }

  close(): void {
    this.isOpenChange.emit(false);
  }
}
