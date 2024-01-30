import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaBuscadorPage } from './pagina-buscador.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaBuscadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaBuscadorPageRoutingModule {}
