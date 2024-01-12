import { Component } from '@angular/core';
import { ProductosService } from "../../services/productos.service";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService} from '../../services/promociones.service';
import { Promocion } from '../promociones/promociones.component';


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
  Ubicacions: Ubicaciones[]
  Promocions: Promociones[]
}

export interface Ubicaciones{
  id: number,
  referencia: string
}

export interface Promociones{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_tipoPromo: number,
  Promocions: en_Promocion[]
}

export interface en_Promocion{
  id: string,
  fecha: string,
  precio: Float32Array
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})

export class ProductosComponent {

  productos: Producto[] = [];
  promociones: Promocion[] = [];
  
  productoSeleccionado: string = '';
  promocionSeleccionada: string = '';

  idProdSelected: string = '';

  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');


  urlFotoProducto = 'http://localhost:3000/api/uploads/fotoproducto/';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;

  iconoOrdenacionDispo: string = 'icon-angle-left';
  iconoOrdenacionPrecio: string = 'icon-angle-left';
  estiloOrdenacionDispo: string = '';
  estiloOrdenacionPrecio: string = '';

  criterioOrdenacionDispo: string = '';
  criterioOrdenacionPrecio: string = '';


  valueBusquedaInput = '';
 

  constructor ( private productoService: ProductosService, private promocionesService: PromocionesService, private route: Router){

  }

  ngOnInit(): void {

    this.getProductos();
    this.getPromociones();
  
  }

  
  //cambio de color según el stock
  colorStock(disponibilidad: number): any{
    if (disponibilidad < 50) {
      return { 'background-color': 'rgb(255, 167, 167)','color': 'red' };
    } else if (disponibilidad >= 50 && disponibilidad <= 100) {
      return { 'background-color': 'rgb(255, 255, 162)', 'color': 'rgb(172, 172, 0)'  };
    } else {
      return { 'background-color': 'rgb(110, 181, 110)', 'color': 'green'  };
    }
  }


  //funcionamiento del select de acción
  cambioAccion(idProd: number){    
    let selects = document.querySelectorAll('select');

    for (let i = 0; i < selects.length; i++) {
      if (selects[i].value === 'borrar') {
        this.mostrarModal();
        this.idProdSelected = ''+idProd;
      }
      if(selects[i].value === 'editar') {
        this.idProdSelected = ''+idProd;
        
        let url = 'productos/editProducto?id='+idProd;
        window.location.href = url;
      }
      
    }
  }

  //ordenar por disponibilidad o precio
  cambiarCriterioOrdenacion(criterio: string){

    let cambiado = false;
  
    if (criterio == 'disponibilidad') {

      this.iconoOrdenacionPrecio = 'icon-angle-left';
      this.estiloOrdenacionPrecio = '';      

      if (this.criterioOrdenacionDispo == '' && !cambiado) {
        cambiado = true;
        
        this.criterioOrdenacionDispo = 'DESC';
        this.iconoOrdenacionDispo = 'icon-angle-down';
        this.estiloOrdenacionDispo = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('cantidad'+this.criterioOrdenacionDispo);
      }
      if (this.criterioOrdenacionDispo == 'DESC' && !cambiado){
        cambiado = true;

        this.criterioOrdenacionDispo = 'ASC';
        this.iconoOrdenacionDispo = 'icon-angle-up';
        this.estiloOrdenacionDispo = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('cantidad'+this.criterioOrdenacionDispo);
      }
      if (this.criterioOrdenacionDispo == 'ASC' && !cambiado){  //al tercer toque vuelve a la ordenacion por defecto
        cambiado = true;

        this.criterioOrdenacionDispo = '';
        this.iconoOrdenacionDispo = 'icon-angle-left';
        this.estiloOrdenacionDispo = '';
        this.getProductos();
      }

    }

    if (criterio == 'precio'){

      this.iconoOrdenacionDispo = 'icon-angle-left';
      this.estiloOrdenacionDispo = '';

      if (this.criterioOrdenacionPrecio == '' && !cambiado) {
        cambiado = true;

        this.criterioOrdenacionPrecio = 'DESC';
        this.iconoOrdenacionPrecio = 'icon-angle-down';
        this.estiloOrdenacionPrecio = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('precio'+this.criterioOrdenacionPrecio);
      }
      if (this.criterioOrdenacionPrecio == 'DESC' && !cambiado){
        cambiado = true;

        this.criterioOrdenacionPrecio = 'ASC';
        this.iconoOrdenacionPrecio = 'icon-angle-up';
        this.estiloOrdenacionPrecio = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('precio'+this.criterioOrdenacionPrecio);
      }
      if (this.criterioOrdenacionPrecio == 'ASC' && !cambiado){
        cambiado = true;

        this.criterioOrdenacionPrecio = '';
        this.iconoOrdenacionPrecio = 'icon-angle-left';
        this.estiloOrdenacionPrecio = '';
        this.getProductos();
      }
    }
  }

  

  irNuevoProducto(){
    this.route.navigate(['productos/newProducto']);
  }




  //MODAL
  mostrarModal(){
    for (let i = 0; i < this.modals.length; i++) {
      this.modals[i].style.display = 'block';
    }
  }
  cerrarModal() {
    // Oculta el modal al hacer clic en la 'X'
    for (let i = 0; i < this.modals.length; i++) {
      this.modals[i].style.display = 'none';
    }

    let selects = document.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
      selects[i].value = '';
    }
  } 

  confirmarBorrado() {
    this.cerrarModal();
    this.borrarProd();
  }


  
  //FUNCIONES CRUD
  getProductos(){
    this.productoService.getAllProductos()
      .subscribe((result) =>{
        this.productos = result.productos;
        console.log(this.productos);
    });
  }

  borrarProd(){
    this.productoService.deleteProducto(this.idProdSelected).subscribe((result) =>{
      this.getProductos(); //Recarga la lista de productos
    });
  }

  getPromociones(){
    this.promocionesService.getAllPromociones().subscribe((result) =>{
        this.promociones = result.promociones;
    });
  }

  getProductosOrdenados(tipoOrdenacion: string){   
    this.productoService.getProductoOrdenado(tipoOrdenacion)
      .subscribe( res =>{
        this.productos = res.productos;
      })
  }

  getBusquedaProducto(){
    this.productoService.getBusquedaProducto(this.valueBusquedaInput)
      .subscribe( res => {
        this.productos = res.productos;
      })
  }
}


