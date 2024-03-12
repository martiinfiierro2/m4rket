import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: '**', redirectTo: '/login' },
    ],
  },
  {path: 'recovery', component: AuthLayoutComponent,
    children: [
      { path: '', component: RecoveryComponent},
      { path: '**', redirectTo: '/recovery'}
    ]
  },
  {path: 'registro', component: AuthLayoutComponent,
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
