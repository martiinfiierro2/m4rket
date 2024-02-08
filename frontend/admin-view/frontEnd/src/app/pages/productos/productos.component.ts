import { Component } from '@angular/core';
import { ProductosService } from "../../services/productos.service";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PromocionesService} from '../../services/promociones.service';
import { Promocion } from '../promociones/promociones.component';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { Ubicacion } from '../ubicaciones/ubicaciones.component';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilterPipe } from '../../pipes/filter.pipe';
import { PaginationComponent } from "../../pagination/pagination.component";


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
  ingredientes: string,
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
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css',
    imports: [CommonModule, FormsModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, PaginationComponent]
})

export class ProductosComponent {
  //Buscador de promociones
  promocionesFiltradas: any[] = [];
  searchText: string = '';

  productos: Producto[] = [];
  promociones: Promocion[] = [];
  ubicaciones: Ubicacion[] = [];
  
  promocionSeleccionada: string = '';

  producto_ubicacion!: Producto;

  idProdSelected: string = '';


  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;

  iconoOrdenacionDispo: string = 'icon-angle-left';
  iconoOrdenacionPrecio: string = 'icon-angle-left';
  estiloOrdenacionDispo: string = '';
  estiloOrdenacionPrecio: string = '';

  criterioOrdenacionDispo: string = '';
  criterioOrdenacionPrecio: string = '';

  visualizacionModalBorrado = 'display: none';
  visualizacionModalUbicacion = 'display: none';

  valorUbicacionProucto: string = '';
  fechaFinUbicacionProducto!: Date;

  valueBusquedaInput = '';

  //Variables paginación
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=4;
 

  constructor ( private productoService: ProductosService, 
                private promocionesService: PromocionesService, 
                private ubicacionService: UbicacionesService,
                private route: Router){
                this.promocionesFiltradas = this.promociones;
  }

  ngOnInit(): void {

    this.getProductos();
    this.getPromociones();
  
  }

  //Filtro buscar promociones
  filtrarPromociones() {
    this.promocionesFiltradas = this.promociones.filter(promocion =>
      promocion.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
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


  //BOTONES ACCIÓN
  irNuevoProducto(){
    this.route.navigate(['productos/newProducto']);
  }

  irEditarProducto(idProd){
    let url = 'productos/editProducto?id='+idProd;
    window.location.href = url;
  }

  ubicarProducto(idProd){
    this.getProductoId(idProd);
    this.getUbicaciones();
    this.mostrarModal('ubicacion');
  }




  //MODALES
  mostrarModal(queModal: string){
    if (queModal === 'borrado') {
      this.visualizacionModalBorrado = 'display: block';
    } else {
      this.visualizacionModalUbicacion = 'display: block';
    }
  }

  cerrarModal(queModal: string) {
    if (queModal === 'borrado') {
      this.visualizacionModalBorrado = 'display: none';
    } else {
      this.visualizacionModalUbicacion = 'display: none';
    }

    let selects = document.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
      selects[i].value = '';
    }
  } 


  anyadirUbicacion(){
  
    let fecha_sistema = new Date();

    let datosUbicacion = {
      idProd: this.producto_ubicacion.id,
      idUbi: parseInt(this.valorUbicacionProucto),
      fecha_ini: this.formatDate(),
      fecha_fin: this.fechaFinUbicacionProducto
    }

    this.postUbicacionProducto(datosUbicacion);
  }


  //FROMATEAR FECHAS
  formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  } 


  //PAGINACION
  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.productoService.getProductosPaginacion(this.posicionactual)
      .subscribe(res =>{
        this.productos = res.productos;
      })
  }

  

  //FUNCIONES CRUD
  getProductos(){
    this.productoService.getAllProductos()
      .subscribe((result) =>{
        this.productos = result.productos;
        console.log(this.productos);
        
        //Paginacion
        this.totalregistros = result.page.total;
    });
  }

  getProductoId(idProd: string){
    this.productoService.getProductoId(idProd).
      subscribe( res =>{
        this.producto_ubicacion = res.productos;    
      })
  }

  borrarProd(idProd){
    this.productoService.deleteProducto(idProd).subscribe((result) =>{
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

  getUbicaciones(){
    this.ubicacionService.getAllUbicaciones()
      .subscribe( res => {
        this.ubicaciones = res.ubicaciones;
      })
  }

  
  postUbicacionProducto(datos: any){
    this.ubicacionService.postUbicacionProducto(datos)
      .subscribe( res => {
        console.log(res);
        this.cerrarModal('ubicacion');
        this.getProductos();
      })
  }
  

}


