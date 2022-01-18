import { Component, Input } from '@angular/core';

@Component({
  selector: 'myp-authentication-header',
  templateUrl: './authentication-header.component.html',
  styleUrls: ['./authentication-header.component.scss'],
})
export class AuthenticationHeaderComponent {
  @Input() showBackButton = true;
  @Input() back: () => void = () => window.history.back();
}
