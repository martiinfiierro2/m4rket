import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProductosService } from "../services/productos.service";
import { environment } from '../../environments/environment'


import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
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
  precio: Float32Array,
  enListaCompra: boolean,
  cantidad: number,
  idLista: string,
}

export interface ListaCompra{
  id: string,
  idUsu: string,
  idProd: number,
  fecha: string | null,
  cantidad: number,
}
@Component({
  selector: 'app-pagina-buscador',
  templateUrl: './pagina-buscador.page.html',
  styleUrls: ['./pagina-buscador.page.scss'],
})
export class PaginaBuscadorPage {
  
  imgUrl = `${environment.baseUrl}/uploads/fotoproducto/`;
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');

  productos: Producto [] = [];
  
  listaCompra: ListaCompra [] = [];

  valueBusquedaInput = '';

  private idUsu: string = '';
  

  constructor(private location: Location, private productosService: ProductosService, private router: Router) { }

  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();
    this.productosService.cargarCabeceras();
  }

  volverAtras() {
    this.location.back();
  }



  getUsuarioLog() {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (idUsuario !== null) {
      this.idUsu = idUsuario;
      console.log('El usuario logueado es: '+ this.idUsu);
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
  }




  cambiaPag(idProd: number): void {
    let url = '/pagina-producto/' + idProd;
    this.router.navigate([url]);
  }


  cantidadProducto: number = 1;


  incrementar(producto: any){
    producto.cantidad++;
      console.log('Nueva cantidad = ' +  producto.cantidad)
      this.actualizarCantidad(producto.id, producto.cantidad, producto.idLista) 
  }

  decrementar(producto: any){
    if (producto.cantidad > 1){
      producto.cantidad--;
    console.log('Nueva cantidad = ' +  producto.cantidad)
    this.actualizarCantidad(producto.id, producto.cantidad, producto.idLista) 
    }else{
      console.log('Solo queda una');
    }
  }

  eliminar(producto: any){
    producto.enListaCompra = false;
    this.borrarProd(producto.idLista);
  }

  anadirProducto(producto: any){
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: producto.id,
      fecha: fechaActual, 
      cantidad: 1
    };
    this.productosService.postListaCompra(body )
    .subscribe((result) => {
      console.log(result);
    })
    this.compararListaBusqueda();
    producto.enListaCompra = true;
    
  }


  getBusquedaProducto() {
    this.productosService.getBusquedaProducto(this.valueBusquedaInput)
      .subscribe(res => {
        this.productos = res.productos;
        console.log(res.productos);
        this.compararListaBusqueda();
      });

      
  }
  getListaCompraUsu() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) => 
        ({ idProd: item.idProd, 
          cantidad: item.cantidad, 
          id: item.id
        }));
  
        console.log(this.listaCompra);
      } 
    });
  }

  compararListaBusqueda(){
    this.listaCompra.forEach((productoCompra) => {
      const productoEncontrado = this.productos.find((producto) => productoCompra.idProd === producto.id);
      if (productoEncontrado) {
        productoEncontrado.enListaCompra = true;
        productoEncontrado.cantidad = productoCompra.cantidad;
        productoEncontrado.idLista = productoCompra.id;
        //console.log(`Producto con id ${productoEncontrado.id} está en la lista y su cantidad es ${productoEncontrado.cantidad}`);
      } else {
       // console.log(`No se encontró el producto con idProd ${productoCompra.idProd} en la lista de productos`);
      }
    });
  }

  borrarProd(idLista: string){
    this.productosService.deleteListaCompra(idLista).subscribe((result) =>{
      //this.getProductos(); //Recarga la lista de productos
    });
  }


  actualizarCantidad(idProd: string, nuevaCantidad: number, idLista: string) {
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: idProd,
      fecha: fechaActual, 
      cantidad: nuevaCantidad
    };

    console.log('Cuerpo de la solicitud:', body);

    this.productosService.putListaCompra(idLista, body)
      .subscribe(
        (res) => {
          console.log('Respuesta correcta:', res);
        },
        (error) => {
          console.error('Error en la solicitud PUT: again', error);
        }
      );
  }

}


