import { Component } from '@angular/core';
import { ProductosService } from "../../services/productos.service";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
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
import { PaginationComponent } from "../../pagination/pagination.component";
import { tipoPromocion } from '../../promociones/new-tipo-promocion/new-tipo-promocion.component';


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
  Ubicacions: Ubicaciones[],
  Promocions: Promociones[]
}

export interface Ubicaciones{
  id: number,
  referencia: string,
  posicion: number
}

export interface Promociones{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_tipoPromo: number,
  en_promocion: en_Promocion
}

export interface en_Promocion{
  id: string,
  fecha: string,
  precio: Float32Array,
  idPromo: number,
  idProd: number
}

@Component({
    selector: 'app-productos',
    standalone: true,
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css',
    imports: [CommonModule, FormsModule, PaginationComponent, ReactiveFormsModule]
})

export class ProductosComponent {
  //Buscador de promociones
  promocionesFiltradas: any[] = [];
  searchText: string = '';

  productos: Producto[] = [];
  productosOrdenados: Producto[] = [];

  promociones: Promocion[] = [];
  tipoPromociones: tipoPromocion[] = [];
  en_promocion: en_Promocion[] = [];
  ubicaciones: Ubicacion[] = [];
  
  promocionSeleccionada: string = '';

  producto_ubicacion!: Producto;
  producto_promocion!: Producto;

  idProdSelected: string = '';


  //variables para mostrar foto
  tokenUsuario = localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  modals = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;

  //Variables ordenación
  iconoOrdenacionDispo: string = 'icon-angle-left';
  iconoOrdenacionPrecio: string = 'icon-angle-left';
  estiloOrdenacionDispo: string = '';
  estiloOrdenacionPrecio: string = '';

  criterioOrdenacionDispo: string = '';
  criterioOrdenacionPrecio: string = '';

  visualizacionModalBorrado = 'display: none';
  visualizacionModalUbicacion = 'display: none';

  ordenacionActiva: boolean = false;
  cambioPromoPorFila: boolean[] = [];

  valorUbicacionProucto: string = '';
  fechaFinUbicacionProducto!: Date;

  valueBusquedaInput = '';

  //Variables paginación
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=4;

  private paginaUsada = 0;
 

  constructor ( private productoService: ProductosService, 
                private promocionesService: PromocionesService, 
                private ubicacionService: UbicacionesService,
                private route: Router){
                this.promocionesFiltradas = this.promociones;
  }

  ngOnInit(): void {

    this.getProductos();
    this.getPromociones();
    this.productos.forEach(() => this.cambioPromoPorFila.push(true));
  
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
        this.ordenacionActiva = true;
        
        this.criterioOrdenacionDispo = 'DESC';
        this.iconoOrdenacionDispo = 'icon-angle-down';
        this.estiloOrdenacionDispo = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('cantidad'+this.criterioOrdenacionDispo);
      }
      if (this.criterioOrdenacionDispo == 'DESC' && !cambiado){
        cambiado = true;
        this.ordenacionActiva = true;

        this.criterioOrdenacionDispo = 'ASC';
        this.iconoOrdenacionDispo = 'icon-angle-up';
        this.estiloOrdenacionDispo = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('cantidad'+this.criterioOrdenacionDispo);
      }
      if (this.criterioOrdenacionDispo == 'ASC' && !cambiado){  //al tercer toque vuelve a la ordenacion por defecto
        cambiado = true;
        this.ordenacionActiva = false;

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
        this.ordenacionActiva = true;

        this.criterioOrdenacionPrecio = 'DESC';
        this.iconoOrdenacionPrecio = 'icon-angle-down';
        this.estiloOrdenacionPrecio = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('precio'+this.criterioOrdenacionPrecio);
      }
      if (this.criterioOrdenacionPrecio == 'DESC' && !cambiado){
        cambiado = true;
        this.ordenacionActiva = true;

        this.criterioOrdenacionPrecio = 'ASC';
        this.iconoOrdenacionPrecio = 'icon-angle-up';
        this.estiloOrdenacionPrecio = 'color: #51877A; font-weight: bold';
        this.getProductosOrdenados('precio'+this.criterioOrdenacionPrecio);
      }
      if (this.criterioOrdenacionPrecio == 'ASC' && !cambiado){ //al tercer toque vuelve a la ordenacion por defecto
        cambiado = true;
        this.ordenacionActiva = false;

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


  //FORMATEAR FECHAS
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
    this.paginaUsada = pagina;

    if (!this.ordenacionActiva) { //si no hay ordenación se hace normal
      this.productoService.getAllProductos(this.posicionactual)
      .subscribe(res =>{
        this.productos = res.productos;
        console.log(this.productos);
      })
    }
    
    else if (this.ordenacionActiva){
      this.productos = [];
      let pos = 0;
    
      for (let i = this.posicionactual; i < pagina * this.registrosporpagina; i++) {  
        if (i < this.productosOrdenados.length) {
          this.productos[pos] = this.productosOrdenados[i];
          pos++; 
        }
      }
    } 

    this.productos.forEach(() => this.cambioPromoPorFila.push(true));
  }

  

  //FUNCIONES CRUD
  getProductos(){
    this.productoService.getAllProductos(this.posicionactual)
      .subscribe((result) =>{
        this.productos = result.productos;
        console.log(this.productos);
        
        //Paginacion
        this.totalregistros = result.page.total;
        console.log(this.totalregistros)
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
    this.promocionesService.getAllPromociones(0).subscribe((result) =>{
        this.promociones = result.promociones;
    });
  }

  getProductosOrdenados(tipoOrdenacion: string){

    this.productoService.getProductoOrdenado(tipoOrdenacion)
      .subscribe( res =>{
        this.productosOrdenados = res.productos;
        this.productos = [];
        if (this.posicionactual == 0) {
          for (let i = 0; i < 4; i++) {
            this.productos[i] = this.productosOrdenados[i];
          }
        }
        else{
          this.cambiarPagina(this.paginaUsada)
        }
      })
  }

  getBusquedaProducto(){
    this.productoService.getBusquedaProducto(this.valueBusquedaInput)
      .subscribe( res => {
        this.productos = res.productos;
        
        //Paginacion
        this.totalregistros = res.productos.length;
        console.log(this.totalregistros)
      })
  }

  getUbicaciones(){
    this.ubicacionService.getAllUbicaciones(0)
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

  asignarPromocion(idProd, precioProd, event, index){
    this.promocionSeleccionada = event.target.value;

    let existePromo = 0;

    for(let i = 0; i < this.promociones.length; i++){
      if(this.promociones[i].nombre == this.promocionSeleccionada){
        existePromo += 1;
      }
    }

    if(existePromo != 0){
      //Modificador de precio
      const promo = this.getPromocionPorNombre(this.promocionSeleccionada);

      //Cambiamos precio
      const precio_promo = ((promo.tipopromo.modificador * 100) * precioProd) / 100;
      const precio_final = (precioProd - precio_promo).toFixed(2);

      let datosPromocion = {
        fecha: this.formatDate(), 
        precio: precio_final,
        idPromo: promo.id,
        idProd: idProd,
      }
      console.log(datosPromocion);
      this.postPromocionProducto(datosPromocion);
      this.cambioPromoPorFila[index] = true;
    }
    else{
      this.cambioPromoPorFila[index] = false;
    }
  }

  actualizarPromocion(idProd, precioProd, event, id, defecto, index){
    this.promocionSeleccionada = event.target.value;

    let existePromo = 0;

    for(let i = 0; i < this.promociones.length; i++){
      if(this.promociones[i].nombre == this.promocionSeleccionada){
        existePromo += 1;
      }
    }

    if(existePromo != 0){
      //Modificador de precio
      const promo = this.getPromocionPorNombre(this.promocionSeleccionada);

      //Cambiamos precio
      const precio_promo = ((promo.tipopromo.modificador * 100) * precioProd) / 100;
      const precio_final = (precioProd - precio_promo).toFixed(2);

      let datosPromocion = {
        fecha: this.formatDate(), 
        precio: precio_final,
        idPromo: promo.id,
        idProd: idProd,
      }
      console.log(datosPromocion);
      this.actualizarPromocionProducto(datosPromocion, id);
      this.cambioPromoPorFila[index] = true;
    }
    else{
      //Modificador de precio
      const promo = this.getPromocionPorNombre(defecto);

      //Cambiamos precio
      const precio_promo = ((promo.tipopromo.modificador * 100) * precioProd) / 100;
      const precio_final = (precioProd - precio_promo).toFixed(2);

      let datosPromocion = {
        fecha: this.formatDate(), 
        precio: precio_final,
        idPromo: promo.id,
        idProd: idProd,
      }
      
      console.log(datosPromocion);
      this.actualizarPromocionProducto(datosPromocion, id);
      this.cambioPromoPorFila[index] = false;
    }

  }

  getPromocionPorNombre(nombrePromocion: string): Promocion | undefined {
    return this.promociones.find(promocion => promocion.nombre === nombrePromocion);
  }

  postPromocionProducto(datos){
    this.promocionesService.postPromocionProducto(datos)
      .subscribe( res => {
        console.log(res);
        this.getProductos();
    })
  }

  actualizarPromocionProducto(datos, id){
    this.promocionesService.updatePromocionProducto(datos, id)
      .subscribe( res => {
        console.log(res);
        this.getProductos();
    })
  }

 
}


