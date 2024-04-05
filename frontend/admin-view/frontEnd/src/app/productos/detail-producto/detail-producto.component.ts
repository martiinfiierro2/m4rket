import { Component } from '@angular/core';
import { Producto } from '../../pages/productos/productos.component';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-detail-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-producto.component.html',
  styleUrl: './detail-producto.component.css'
})
export class DetailProductoComponent {

  public productoMostrar: Producto;

  //variables para mostrar foto
  tokenUsuario = localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  constructor( private productoService: ProductosService){}

  ngOnInit(){
    this.obtenerProducto();
  }

  obtenerProducto(){

    let idProd = '';
    for (let i = 4; i < window.location.search.length; i++) {
      idProd = idProd + window.location.search[i];
    }

  
    this.productoService.getProductoId(idProd)
      .subscribe( res =>{
        this.productoMostrar = res.productos;
      });


  }

}
