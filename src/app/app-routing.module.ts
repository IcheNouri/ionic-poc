import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {NavbarMode} from './core/navbar/model/navbar-mode.enum';
import {UserRouteAccessService} from './core/auth/user-route-access.service';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    data: {
      pageTitle: 'home.title',
      navbarMode: NavbarMode.EXTENDED,
    },
  //  canActivate: [UserRouteAccessService],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
