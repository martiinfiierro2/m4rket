import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from "../productos/productos.component";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaginationComponent } from "../../pagination/pagination.component";
import * as echarts from 'echarts';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { log } from 'node:console';


export interface Contador{
  id: number,
  nombre: string,
  idProd: number,
  qr: number
  fecha: Date,
}
export interface Tiempo{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  idLista: number,
  idUsu: number
}
export class DatosContadores{
  value: string;
  name: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, PaginationComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})

export class EstadisticasComponent {
  anadidos: DatosContadores[] = [];
  prodMasAnadido: Producto;
  prodMasEliminado: Producto;
  eliminados: DatosContadores[] = [];
  datosSecciones: DatosContadores[] = [];
  numQR: any[] = [];
  tiempos: Tiempo[] = [];
  productos: Producto[] = [];
  masAnadido: any;
  masEliminado: any;
  secciones: any;
  aux: DatosContadores[] = [];
  usuariosActivos: any;
  fecha: string;
  idProd: string;
  listaMasComprados: any = this.anadidos.slice(0, 5);
  

  
  
  //Fitro fechas
  fechaInicio: string="";
  fechaFin: string="";

  //VARIABLES GLOBALES
  totalAnadidos: number = 0;
  totalEliminados: number = 0;

  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';


  //Variables para el gráfico: 
  xAxisData: string[] = [];
  seriesData: number[] = [];
  echartsInstance: any;

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private elementRef: ElementRef,
    private route: Router){
  }

  fechasDefecto(){
    const hoy = new Date();
    const fechaInicio = new Date(hoy);
    const fechaFin = new Date(hoy);

    fechaInicio.setDate(fechaInicio.getDate() - 7);

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];
    this.calcularEjeX('7d');

    console.log('La fecha de inicio es: ' + this.fechaInicio + ' y la fecha de fin es: ' + this.fechaFin); 


  }

  obtenerFechasRangoSeleccionado(opcion: string) {
    const hoy = new Date();
    const fechaInicio = new Date(hoy);
    const fechaFin = new Date(hoy);
  
    switch (opcion) {
      case '7d':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        this.calcularEjeX('7d');
        this.pruebaGrafico();
        break;
      case '1m':
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        this.calcularEjeX('1m');
        this.pruebaGrafico();
        break;
      case '12m':
        fechaInicio.setFullYear(fechaInicio.getFullYear()- 1);
        this.calcularEjeX('12m');
        this.pruebaGrafico();
        break;
    }
  
    const fechaInicioFormateada = fechaInicio.toISOString().split('T')[0];
    const fechaFinFormateada = fechaFin.toISOString().split('T')[0];

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];

    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
  
    return {
      fechaInicio: fechaInicioFormateada,
      fechaFin: fechaFinFormateada
    };
    
  }

  mostrarGrafico(nombre: string): void {
    let url = '/datos?nombre='+nombre;
    window.location.href = url;
  }

  ngOnInit(): void {
    this.fechasDefecto();
    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
    this.pruebaGrafico();
    
  }
  
  private pruebaGrafico() {
    const chartElement = document.getElementById('grafico');
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      // Eliminar el gráfico existente si lo hay
      echarts.dispose(chartElement);
  
      // Crear un nuevo gráfico
      const myChart = echarts.init(chartElement);
  
      const option: any = {
        xAxis: {
          type: 'category',
          data: this.xAxisData, // Actualiza esta propiedad según tu lógica
          show: true,
        },
        yAxis: {
          type: 'value',
          show: true
        },
        series: [
          {
            name: 'Nutrientes',
            type: 'line',
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'top'
            },
            data:[65, 59, 80, 81, 56, 55, 80], // Actualiza esta propiedad según tu lógica
            fill: false,
            borderColor: 'rgb(60, 179, 113)',
            tension: 0.9
          }
        ]
      };
  
      // Establecer las opciones en el nuevo gráfico
      myChart.setOption(option);
    } else {
      console.warn('El elemento "grafico" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }
  
  
  calcularEjeX(opcion: string): string[] {
 
  const hoy = new Date();

  this.xAxisData= [];
  
  switch (opcion) {
    case '7d':
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        this.xAxisData.push(this.obtenerNombreDiaSemana(fecha));
      }
      break;
    case '1m':
      const fechaInicio30d = new Date(hoy);
      fechaInicio30d.setDate(fechaInicio30d.getDate() - 29);
      for (let i = 0; i < 30; i++) {
        const fecha = new Date(fechaInicio30d);
        fecha.setDate(fecha.getDate() + i);
        this.xAxisData.push(fecha.toLocaleDateString('es-ES', { day: 'numeric' }));
      }
      break;
    case '12m':
      const fechaInicio1a = new Date(hoy);
      fechaInicio1a.setFullYear(fechaInicio1a.getFullYear() - 1);
      fechaInicio1a.setMonth(hoy.getMonth() + 1); // Ajuste para iniciar desde el mes siguiente al actual
      for (let i = 0; i < 12; i++) {
        const fecha = new Date(fechaInicio1a);
        fecha.setMonth(fecha.getMonth() + i);
       this.xAxisData.push(fecha.toLocaleDateString('es-ES', { month: 'long' }));
      }
      break;
    default:
      break;
  }
  return this.xAxisData;
}

obtenerNombreDiaSemana(fecha: Date): string {
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return diasSemana[fecha.getDay()];
}


  //CRUD
  async getContadoresMasAnadidos() {
    this.anadidos = [];
    this.totalAnadidos = 0;
    if(this.fechaFin !== "" && this.fechaInicio !== ""){
      try {
        const res = await this.estadisticasService.getCountAnadidosFecha(this.fechaInicio, this.fechaFin).toPromise();
        console.log(res);
        
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.anadidos.push(contador);
          this.totalAnadidos += parseInt(contador.value);
        }
        //this.configurarGraficoAnadidos();
      } catch (error) {
        console.error(error);
      }
    }
    else{
      try {
        const res = await this.estadisticasService.getCountAnadidos().toPromise();
    
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          //contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.anadidos.push(contador);
        }
        //this.configurarGraficoAnadidos();
      } catch (error) {
        console.error(error);
      }
    }
  }
/*
  getUsuariosActivos(){
    let res = this.estadisticasService.getUsuariosActivos().subscribe( res => {
      this.usuariosActivos = res.usuariosActivos;
    });
  }
*/
  async getContadoresMasEliminados() {
    this.eliminados = [];
    this.totalEliminados = 0;
    if(this.fechaFin !== "" && this.fechaInicio !== ""){
      try {
        const res = await this.estadisticasService.getCountEliminadosFecha(this.fechaInicio, this.fechaFin).toPromise();
        console.log(res);
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          //contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.eliminados.push(contador);
          this.totalEliminados += parseInt(contador.value);
        }
        //this.configurarGraficoEliminados();
      } catch (error) {
        console.error(error);
      }
    }
    else{
      try {
        const res = await this.estadisticasService.getCountEliminados().toPromise();
        console.log(res);
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          //contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.eliminados.push(contador);
        }
        console.log(this.eliminados);
       // this.configurarGraficoEliminados();
      } catch (error) {
        console.error(error);
      }
    }
  }
  
}
