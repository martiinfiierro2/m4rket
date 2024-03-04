import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProductosService } from "../services/productos.service";

import { ActivatedRoute } from '@angular/router';

export interface Producto{
  id: number,
  nombre: string,
  marca: string,
  categoria: string,
  stock: number,
  valor_energetico: Float32Array,
  grasas: Float32Array,
  grasas_saturadas: Float32Array,
  hidratos_carbono: Float32Array,
  azucares: Float32Array,
  fibra: Float32Array,
  proteina: Float32Array,
  sal: Float32Array,
  precio_kg: Float32Array,
  ingerdientes: string,
  foto: string,
  precio: Float32Array
}

@Component({
  selector: 'app-pagina-producto',
  templateUrl: './pagina-producto.page.html',
  styleUrls: ['./pagina-producto.page.scss'],
})
export class PaginaProductoPage implements OnInit {

  productos: any;

  idProd: string = '';

  dispo: string = '';

  constructor( private route: ActivatedRoute, private productoService: ProductosService, private location: Location) {
   }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id !== null) {
        this.idProd = id;
      } else {
        console.error('El parámetro "id" es nulo.');
      }
    });

   this.getProducto();

    
    
  }
  volverAtras() {
    this.location.back();
  }

  colorStock(disponibilidad: number): any{
    if (disponibilidad = 0) {
      this.dispo = 'Agotado';
      return { 'color': 'red' };
      
    } else {
      this.dispo = 'Disponible'
      return { 'color': 'green'  };
    }
  }

  getProducto(){
    this.productoService.getProductoId(this.idProd).subscribe( result => {
      this.productos = result.productos;
      console.log(this.productos);
    });
  }

}

