import { IonicModule } from '@ionic/angular';
import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

//import { ProductoComponent } from '../producto/producto.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page]
})


export class Tab1PageModule{}


//FUNCIONES CRUD
/*
getProductos(){
  this.productoService.getAllProductos().subscribe((result) =>{
    this.productos = result.productos;
    console.log(this.productos);
  });
}*/