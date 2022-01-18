import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'myp-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent {
  @Input() show = false;
  @Input() customMessage?: TemplateRef<any>;
}
