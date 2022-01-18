import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'myp-navbar-extended',
  templateUrl: './navbar-extended.component.html',
  styleUrls: ['./navbar-extended.component.scss'],
})
export class NavbarExtendedComponent {
  @Input() firstName = '';
  @Input() lastName = '';

  searchValue: FormControl = new FormControl('');

  constructor(private router: Router) {}

  search(): void {
    const value = this.searchValue.value;
    if (value) {
      this.router.navigate(['/documents'], { queryParams: { name: value } });
    }
  }
}
