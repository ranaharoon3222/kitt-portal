import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '',   
    redirectTo: '/account/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'account', 
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule) 
  },
  { 
    path: 'frontend', 
    loadChildren: () => import('./frontend/frontend.module').then(m => m.FrontendModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
