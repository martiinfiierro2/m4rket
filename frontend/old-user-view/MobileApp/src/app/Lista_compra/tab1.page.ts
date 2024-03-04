// tab1.page.ts
import { Component, OnInit } from '@angular/core';

import { ProductosService } from "../services/productos.service";

//import { environment } from '../../../environments/environment.development';

import { Router } from '@angular/router';

export interface Producto{
  id: string,
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
  //Ubicacions: Ubicaciones[]
 //Promocions: Promociones[]

 cantidad: number,
}

export interface ListaCompra{
  id: string,
  idUsu: string,
  idProd: string,
  fecha: string | null,
  cantidad: number,
}
interface ProductoDetalle {
  nombre: string,
  precio: number,
  foto: string,
  cantidad: number,
  idProducto: string,
  idLista: string,
  contador: boolean,
}
//const idUsuarioAlmacenado = localStorage.getItem('idUsuario');



@Component({
  selector: 'app-Lista_compra',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  productos: Producto [] = [];
  private idUsu: string = '';
  listaCompra: ListaCompra [] = [];

  private idListaUsu: string = '';
  detallesProductos: ProductoDetalle[] = [];




  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  //urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';



  constructor(private productosService: ProductosService, private router: Router) { }
  
  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();

  }

  incrementar(productoDetalle: any) {
      productoDetalle.cantidad++;
      console.log('Nueva cantidad = ' +  productoDetalle.cantidad)
      this.actualizarCantidad(productoDetalle.idProducto, productoDetalle.cantidad, productoDetalle.idLista) 
  }

  decrementar(productoDetalle: any) {
    console.log('El id de la lista es: ' + productoDetalle.idLista);
    if (productoDetalle.cantidad > 1) {
      productoDetalle.cantidad--;
      console.log('Nueva cantidad = ' +  productoDetalle.cantidad)
      this.actualizarCantidad(productoDetalle.idProducto, productoDetalle.cantidad, productoDetalle.idLista)
    } else {
    }
  }

  eliminar(productoDetalle: any) {
    this.borrarProd(productoDetalle.idLista);
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

  cambiaPag(idProd: string): void {
    let url = '/pagina-producto/' + idProd;
    this.router.navigate([url]);
  }
//Funciones CRUD


getListaCompraUsu() {
  this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
    if (result.listacompra) {
      this.listaCompra = result.listacompra.map((item: ListaCompra) => 
      ({ idProd: item.idProd, 
        cantidad: item.cantidad, 
        id: item.id
      }));

      console.log(this.listaCompra);


      const detallesProductos: ProductoDetalle[] = [];

      this.listaCompra.forEach((productoCompra) => {
        this.getDetalleProducto(productoCompra.idProd, detallesProductos, productoCompra.cantidad, productoCompra.id);
      });
    } else {
      console.error('Error en la búsqueda dentro de lssta compra.');
    }
  });
}

getDetalleProducto(idProd: string, detallesProductos: ProductoDetalle[], cantidadProd: number, idLista: string) {
  const quantity = cantidadProd;
  const idP = idProd;
  const idL = idLista;
  let mostrarContador = false;
  if(quantity > 0) {
    mostrarContador = true;
  }else{
    mostrarContador = false;
  }
  this.productosService.getProductoId(idProd).subscribe((producto) => {
    const productoDetalle: ProductoDetalle = {
      nombre: producto.productos.nombre,
      precio: producto.productos.precio,
      foto: producto.productos.foto,
      cantidad: quantity,
      idProducto: idP,
      idLista: idL,
      contador: mostrarContador,
    };
    detallesProductos.push(productoDetalle);

    //console.log('Detalles del producto:', productoDetalle);
    //console.log('Los productos son: ', detallesProductos);

    this.detallesProductos = detallesProductos;
  });
}

borrarProd(idLista: string){
  this.productosService.deleteListaCompra(idLista).subscribe((result) =>{
  this.getListaCompraUsu();
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


