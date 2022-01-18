import { Component, Input } from '@angular/core';
import {slide} from '../slide.animation';

@Component({
  selector: 'myp-bottom-drawer',
  templateUrl: './bottom-drawer.component.html',
  styleUrls: ['./bottom-drawer.component.scss'],
  animations: [slide('bottom')],
})
export class BottomDrawerComponent {
  @Input() isOpen = false;
}
