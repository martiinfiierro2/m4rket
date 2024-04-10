import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomePage } from './home/home.page';
import { authGuard, authGuard2 } from './guards/auth.guard';
const routes: Routes = [
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    canActivate: [authGuard2],
    children: [
      { path: '', component: LoginComponent },
      { path: '**', redirectTo: '/login' },
    ],
  },
  {path: 'registro', component: AuthLayoutComponent, canActivate: [authGuard2],
    children: [
      { path: '', component: SignUpComponent},
      { path: '**', redirectTo: '/registro'}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
