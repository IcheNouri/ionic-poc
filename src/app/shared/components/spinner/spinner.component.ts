import { Component, Input } from '@angular/core';
import {BoostrapColor} from '../../models/boostrap-color';

export type SpinnerSize = 'default' | 'font-size' | 'expand';

@Component({
  selector: 'myp-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() color: BoostrapColor = 'black';
  @Input() size: SpinnerSize = 'default';
}
