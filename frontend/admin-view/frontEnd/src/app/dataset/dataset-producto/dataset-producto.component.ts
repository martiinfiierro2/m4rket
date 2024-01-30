import { Component } from '@angular/core';
import { Producto } from "../../pages/productos/productos.component"
import { ProductosService } from "../../services/productos.service";

@Component({
  selector: 'app-dataset-producto',
  standalone: true,
  imports: [],
  templateUrl: './dataset-producto.component.html',
  styleUrl: './dataset-producto.component.css'
})
export class DatasetProductoComponent {

  public producto!: Producto;

  constructor( private productoService: ProductosService){}

  ngOnInit(): void{
    this.getProductoId();
  }

  getProductoId(){
    console.log(window.location.search);
  }
  

}
