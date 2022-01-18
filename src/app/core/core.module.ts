import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarSimpleComponent } from './navbar/navbar-simple/navbar-simple.component';
import { NavbarExtendedComponent } from './navbar/navbar-extended/navbar-extended.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PageRibbonComponent} from './page-ribbon.component';
import {ToastContainerComponent} from './toast-container/toast-container.component';
import {SharedModule} from "../shared/shared.module";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [NavbarComponent, PageRibbonComponent, ToastContainerComponent, NavbarSimpleComponent, NavbarExtendedComponent],
  exports: [NavbarComponent, PageRibbonComponent, ToastContainerComponent],
  imports: [CommonModule, SharedModule, IonicModule],
})
export class CoreModule {}
