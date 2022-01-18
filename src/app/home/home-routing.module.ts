import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {NavbarMode} from '../core/navbar/model/navbar-mode.enum';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      pageTitle: 'home.title',
      navbarMode: NavbarMode.EXTENDED,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
