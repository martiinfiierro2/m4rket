import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from "./auth/recovery/recovery.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { NewProductoComponent } from './productos/new-producto/new-producto.component';
import { EditPorductoComponent } from "./productos/edit-porducto/edit-porducto.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { NewPromocionComponent } from './promociones/new-promocion/new-promocion.component';
import { EditPromocionComponent } from './promociones/edit-promocion/edit-promocion.component';
import { NewTipoPromocionComponent } from './promociones/new-tipo-promocion/new-tipo-promocion.component';
import { UbicacionesComponent } from './pages/ubicaciones/ubicaciones.component';
import { LandingComponent } from "./pages/landing/landing.component";
import { DatasetComponent } from './pages/dataset/dataset.component';
import { DatasetProductoComponent } from './dataset/dataset-producto/dataset-producto.component';
import { PaginationComponent } from './pagination/pagination.component';


export const routes: Routes = [

  { path: '', component: LandingComponent},
  { path: 'dataset', component: DatasetComponent},
  { path: 'dataset-producto', component: DatasetProductoComponent},
  
  { path: 'pruebaPaginacion', component: PaginationComponent},

  { path: 'login', component: AuthLayoutComponent,
      children: [
        { path: '', component: LoginComponent},
        { path: '**', redirectTo: ''}
      ]
  },
  { path: 'registro', component: AuthLayoutComponent,
      children: [
        { path: '', component: SignUpComponent},
        { path: '**', redirectTo: ''}
      ]
  },
  { path: 'recovery', component: AuthLayoutComponent,
    children: [
      { path: '', component: RecoveryComponent},
      { path: '**', redirectTo: ''}
    ]
  },
  { path: 'productos', component: AdminLayoutComponent,
      children: [
        { path: '', component: ProductosComponent},
        { path: 'newProducto',component: NewProductoComponent},
        { path: 'editProducto',component: EditPorductoComponent},
        { path: '*', redirectTo: ''}
      ]
  },
  { path: 'promociones', component: AdminLayoutComponent,
      children: [
        { path: '', component: PromocionesComponent},
        { path: 'newPromocion',component: NewPromocionComponent},
        { path: 'editPromocion',component: EditPromocionComponent},
        { path: 'newTipoPromocion',component: NewTipoPromocionComponent},
        { path: '*', redirectTo: ''}
      ]
  },
  { path: 'ubicaciones', component: AdminLayoutComponent,
      children: [
        { path: '', component: UbicacionesComponent},
        { path: '*', redirectTo: ''}
      ]

  }
  



];
