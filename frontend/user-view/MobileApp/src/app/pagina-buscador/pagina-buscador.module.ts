import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaBuscadorPageRoutingModule } from './pagina-buscador-routing.module';

import { PaginaBuscadorPage } from './pagina-buscador.page';

import { TabsPageModule } from '../tabs/tabs.module';

import { RouterModule } from '@angular/router'; 


import { ProductosService } from "../services/productos.service";
//import { AppModule } from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaBuscadorPageRoutingModule,
    TabsPageModule,

  ],
  declarations: [PaginaBuscadorPage]
})
export class PaginaBuscadorPageModule {

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
  }
}
