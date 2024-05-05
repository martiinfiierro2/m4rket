import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { NewProductoComponent } from './productos/new-producto/new-producto.component';
import { EditPorductoComponent } from "./productos/edit-porducto/edit-porducto.component";
import { NewPromocionComponent } from './promociones/new-promocion/new-promocion.component';
import { EditPromocionComponent } from './promociones/edit-promocion/edit-promocion.component';
import { NewTipoPromocionComponent } from './promociones/new-tipo-promocion/new-tipo-promocion.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { LandingComponent } from "./pages/landing/landing.component";
import { DatasetComponent } from './pages/dataset/dataset.component';
import { DatasetProductoComponent } from './dataset/dataset-producto/dataset-producto.component';
import { PaginationComponent } from './pagination/pagination.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { DatosComponent } from './pages/datos/datos.component';
import { EditUbicacionComponent } from './ubicaciones/edit-ubicacion/edit-ubicacion.component';
import { NewUbicacionComponent } from './ubicaciones/new-ubicacion/new-ubicacion.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DetailProductoComponent } from './productos/detail-producto/detail-producto.component';

import { authGuard, authGuard2 } from "../app/guards/auth.guard";
import { rolGuard } from './guards/rol.guard';



export const routes: Routes = [

  { path: '', component: LandingComponent},
  { path: 'dataset', component: DatasetComponent},
  { path: 'dataset-producto', component: DatasetProductoComponent},

  { path: 'login', component: LoginComponent, canActivate: [authGuard2],
      children: [
        { path: '', component: LoginComponent},
        { path: '**', redirectTo: ''}
      ]
  },

  { path: 'productos', component: AdminLayoutComponent, canActivate: [authGuard],
      children: [
        { path: '', component: ProductosComponent},
        { path: 'newProducto',component: NewProductoComponent},
        { path: 'editProducto',component: EditPorductoComponent},
        { path: 'detailProducto', component: DetailProductoComponent},
        { path: '*', redirectTo: ''}
      ]
  },
  { path: 'promociones', component: AdminLayoutComponent, canActivate: [authGuard],
      children: [
        { path: '', component: PromocionesComponent},
        { path: 'newPromocion',component: NewPromocionComponent},
        { path: 'editPromocion',component: EditPromocionComponent},
        { path: 'newTipoPromocion',component: NewTipoPromocionComponent},
        { path: '*', redirectTo: ''}
      ]
  },
  { path: 'ubicaciones', component: AdminLayoutComponent, canActivate: [authGuard],
      children: [
        { path: '', component: UbicacionesComponent},
        { path: 'editUbicacion',component: EditUbicacionComponent},
        { path: 'newUbicacion',component: NewUbicacionComponent},
        { path: '*', redirectTo: ''}
      ]

  },
  { path: 'estadisticas', component: AdminLayoutComponent, canActivate: [authGuard],
      children: [
        { path: '', component: EstadisticasComponent},
        { path: '*', redirectTo: ''}
      ]
  },
  { path: 'datos', component: AdminLayoutComponent, canActivate: [authGuard],
    children: [
      { path: '', component: DatosComponent},
      { path: '*', redirectTo: ''}
    ]
  },
  { path: 'usuarios', component: AdminLayoutComponent, canActivate: [authGuard, rolGuard],
    children: [
      { path: '', component: UsuariosComponent},
      { path: '*', redirectTo: ''}
    ]

  }
  



];
