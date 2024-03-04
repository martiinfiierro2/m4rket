
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { PaginaProductoPage } from './pagina-producto/pagina-producto.page';
import { PaginaProductoPageModule } from './pagina-producto/pagina-producto.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'pagina-producto/:id', // Incluye el parámetro de ruta ':id'
    loadChildren: () => import('./pagina-producto/pagina-producto.module').then((m) => m.PaginaProductoPageModule),
  },

  /*
  {
    path: 'pagina-producto',
      children: [
        {path: '', component: PaginaProductoPage},
        {path: '', component: PaginaProductoPage},
      ]
  },*/
  {
    path: 'pagina-buscador',
    loadChildren: () => import('./pagina-buscador/pagina-buscador.module').then( m => m.PaginaBuscadorPageModule),
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
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
