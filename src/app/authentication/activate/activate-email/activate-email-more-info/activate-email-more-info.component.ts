import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'myp-activate-email-more-info',
  templateUrl: './activate-email-more-info.component.html',
  styleUrls: ['./activate-email-more-info.component.scss'],
})
export class ActivateEmailMoreInfoComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
