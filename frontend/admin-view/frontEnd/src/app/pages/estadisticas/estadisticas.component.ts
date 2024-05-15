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
import { waitForAsync } from '@angular/core/testing';


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
  foto: string;
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
  buscados: DatosContadores[] = [];
  comprados: DatosContadores[] = [];
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
  activos: any;
  fecha: string;
  idProd: string;
  listaMasComprados: any = this.anadidos.slice(0, 5);
  

  
  
  //Fitro fechas
  fechaInicio: string="";
  fechaFin: string="";

  //VARIABLES GLOBALES
  totalAnadidos: number = 0;
  totalEliminados: number = 0;
  totalActivos: number = 0;
  totalComprados: number = 0;
  totalBuscados: number = 0;
  porcentaje: number = 0;


  //VARIABLES TENDENCIA 
  tendenciaAnadidos: number = 0;
  tendenciaEliminados: number = 0;
  tendenciaActivos: number = 0;
  tendenciaComprados: number = 0;
  tendenciaBuscados: number = 0;
  tendenciaFechaInicio: string="";
  tendenciaFechaFin: string ="";

  pAnadidos: number = 0;
  cAnadidos: boolean = true;
  pEliminados: number = 0;
  cEliminados: boolean = true;
  pComprados: number = 0;
  cComprados: boolean = true;


  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';


  //Variables para el gráfico: 
  xAxisData: string[] = [];


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
    const fechaTendenciaInicio =  new Date(hoy);

    fechaTendenciaInicio.setDate(fechaInicio.getDate() - 14);

    fechaInicio.setDate(fechaInicio.getDate() - 7);

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];

    this.tendenciaFechaFin = fechaInicio.toISOString().split('T')[0];
    this.tendenciaFechaInicio = fechaTendenciaInicio.toISOString().split('T')[0];
  }

  async actualizarDatos(opcion: string){
    this.getContadoresMasBuscados();
    this.getContadoresMasEliminados(opcion);
    this.getContadoresActivos(opcion);
    this.getContadoresComprados(opcion);
    this.getContadoresListados(opcion);
  }

  async obtenerFechasRangoSeleccionado(opcion: string) {
    const hoy = new Date();
    const fechaInicio = new Date(hoy);
    const fechaFin = new Date(hoy);
    const fechaTendenciaInicio =  new Date(hoy);
    const fechaTendenciaFin = new Date(hoy);
  
    switch (opcion) {
      case '7d':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        fechaTendenciaInicio.setDate(fechaInicio.getDate() - 14);
        fechaTendenciaFin.setDate(fechaInicio.getDate() - 7);
        break;
      case '1m':
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        fechaTendenciaInicio.setDate(fechaInicio.getDate() - 60);
        fechaTendenciaFin.setDate(fechaInicio.getDate() - 30);
        break;
      case '12m':
        fechaInicio.setFullYear(fechaInicio.getFullYear()- 1);
        fechaTendenciaInicio.setFullYear(fechaInicio.getFullYear() - 2);
        fechaTendenciaFin.setFullYear(fechaInicio.getFullYear()- 1);
        break;
    }
  
    const fechaInicioFormateada = fechaInicio.toISOString().split('T')[0];
    const fechaFinFormateada = fechaFin.toISOString().split('T')[0];

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];

    this.tendenciaFechaFin = fechaTendenciaFin.toISOString().split('T')[0];
    this.tendenciaFechaInicio = fechaTendenciaInicio.toISOString().split('T')[0];

    console.log('Fecha inicio tendencia: ' + this.tendenciaFechaInicio + 'al ' + this.tendenciaFechaFin);

    this.actualizarDatos(opcion);
  
    return {
      fechaInicio: fechaInicioFormateada,
      fechaFin: fechaFinFormateada
    };
    
  }

  ngOnInit(): void {
    this.fechasDefecto();
    this.getContadoresMasBuscados();
    this.getContadoresMasEliminados('7d');
    this.getContadoresActivos('7d');
    this.getContadoresComprados('7d');
    this.getContadoresListados('7d');
    //this.pruebaGrafico();
    
  }
  
  async pruebaGrafico(opcion: any, respuesta: any) {
    const chartElement = document.getElementById('grafico');
    const datos = await this.procesarDatos(opcion, respuesta);
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      echarts.dispose(chartElement);
  
      const myChart = echarts.init(chartElement);
  
      const option: any = {
        color:'rgba(81, 135, 122, 1)' ,
        xAxis: {
          type: 'category',
          data: this.xAxisData,
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
            data: datos,
            smooth: true,
          }
        ]
      };
  
      myChart.setOption(option);
    } else {
      console.warn('El elemento "grafico" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }

  async graficoListados(opcion: any, respuesta: any) {
    const chartElement = document.getElementById('graf-list');
    
    const datos = await this.procesarDatos(opcion, respuesta);
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      echarts.dispose(chartElement);
  
      const myChart = echarts.init(chartElement);
  
      const option: any = {
        color:'rgba(81, 135, 122, 1)' ,
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false
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
            data:datos,
            smooth: true,
          }
        ]
      };
  
      myChart.setOption(option);
    } else {
      console.warn('El elemento "grafico" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }

  async graficoComprados(opcion: any, respuesta: any) {
    const chartElement = document.getElementById('graf-comp');
    
    const datos = await this.procesarDatos(opcion, respuesta);
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      echarts.dispose(chartElement);
  
      const myChart = echarts.init(chartElement);
  
      const option: any = {
        color:'rgba(81, 135, 122, 1)' ,
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false
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
            data:datos,
            smooth: true,
          }
        ]
      };
  
      myChart.setOption(option);
    } else {
      console.warn('El elemento "grafico" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }

  async graficoEliminados(opcion: any, respuesta: any) {
    const chartElement = document.getElementById('graf-elim');
    
    const datos = await this.procesarDatos(opcion, respuesta);
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      echarts.dispose(chartElement);
  
      const myChart = echarts.init(chartElement);
  
      const option: any = {
        color:'rgba(81, 135, 122, 1)' ,
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false
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
            data:datos,
            smooth: true,
          }
        ]
      };
  
      myChart.setOption(option);
    } else {
      console.warn('El elemento "grafico" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }
  
  obtenerNombreDiaSemana(fecha: Date): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
  }


  //CRUD
  async getContadoresMasBuscados() {
    this.buscados = [];
    this.totalBuscados = 0;
    if(this.fechaFin !== "" && this.fechaInicio !== ""){
      try {
        const res = await this.estadisticasService.getCountBuscadosFecha(this.fechaInicio, this.fechaFin).toPromise();
        //console.log(res);
        
        for (let index = 0; index < 7; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          contador.foto = res2.productos.foto;
          this.buscados.push(contador);
          this.totalBuscados += parseInt(contador.value);
        }
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
  async getContadoresMasEliminados(opcion:string) {
    this.eliminados = [];
    this.totalEliminados = 0;
      try {
        const res = await this.estadisticasService.getCountEliminadosFecha(this.fechaInicio, this.fechaFin).toPromise();
        console.log(res);
              
       // await this.procesarDatos(opcion, res);
       await this.graficoEliminados(opcion, res);

        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          //contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.eliminados.push(contador);
          this.totalEliminados += parseInt(contador.value);
        }
      await this.getTendenciaEliminados();
      } catch (error) {
        console.error(error);
      }
    
  }

  async getContadoresActivos(opcion: string) {
    this.activos = [];
    this.totalActivos = 0;
    try {
      const res = await this.estadisticasService.getCountActivosFecha(this.fechaInicio, this.fechaFin).toPromise();
      //console.log(res);
      await this.pruebaGrafico(opcion, res);

    } catch (error) {
      console.error(error);
    }
  }

  async getContadoresComprados(opcion: string) {
    this.comprados = [];
    this.totalComprados = 0;
    try {
      const res = await this.estadisticasService.getCountCompradosFecha(this.fechaInicio, this.fechaFin).toPromise();
      //console.log(res);
      await this.graficoComprados(opcion, res);

      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
        //contador.name = res2.productos.nombre;
        contador.value = res.datosContadores[index].totalCount;
        this.comprados.push(contador);
        this.totalComprados += parseInt(contador.value);
      }
      await this.getPorcentajeComprados();
      await this.getTendenciaComprados();
    } catch (error) {
      console.error(error);
    }
  }

  async getContadoresListados(opcion: string) {
    this.anadidos = [];
    this.totalAnadidos = 0;
    try {
      const res = await this.estadisticasService.getCountListadosFecha(this.fechaInicio, this.fechaFin).toPromise();
      console.log(res);
      await this.graficoListados(opcion, res);

      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
        //contador.name = res2.productos.nombre;
        contador.value = res.datosContadores[index].totalCount;
        this.anadidos.push(contador);
        this.totalAnadidos += parseInt(contador.value);
      }
      await this.getTendenciaListados();
    } catch (error) {
      console.error(error);
    }
  }
  
  async getPorcentajeComprados(){
    await Promise.all([this.totalComprados, this.totalAnadidos]);
    this.porcentaje = 0;
    if(this.totalComprados && this.totalAnadidos){
      this.porcentaje = parseFloat((this.totalComprados * 100 / this.totalAnadidos).toFixed(2));
    }
  }

  async procesarDatos(opcion: string, res: any) {
    let datos;
    switch (opcion) {
      case '7d':
        datos = await this.procesarDatosPorUltimos7Dias(res);
        break;
      case '1m':
        datos = await this.procesarDatosPorUltimos30Dias(res);
        break;
      case '12m':
        datos = await this.procesarDatosPorUltimoAno(res);
        break;
    }

    return datos;
  }



  // DATOS DE TENDENCIA
  async getTendenciaListados() {
    this.tendenciaAnadidos = 0;
    this.pAnadidos = 0;
    try {
      const res = await this.estadisticasService.getCountListadosFecha(this.tendenciaFechaInicio, this.tendenciaFechaFin).toPromise();
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
        contador.value = res.datosContadores[index].totalCount;
        this.tendenciaAnadidos += parseInt(contador.value);
      }
    } catch (error) {
      console.error(error);
    }
    if(this.totalAnadidos){
      this.pAnadidos = parseFloat((((this.totalAnadidos - this.tendenciaAnadidos) / this.tendenciaAnadidos) * 100).toFixed(2));
      if(this.pAnadidos < 0){
        this.cAnadidos = false;
      }
    }
    
  }


  async getTendenciaEliminados() {
    this.tendenciaEliminados = 0;
    this.pEliminados = 0;
      try {
        const res = await this.estadisticasService.getCountEliminadosFecha(this.tendenciaFechaInicio, this.tendenciaFechaFin).toPromise();
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
          contador.value = res.datosContadores[index].totalCount;
          this.tendenciaEliminados += parseInt(contador.value);
        }
      } catch (error) {
        console.error(error);
      }
      if(this.totalEliminados){
        this.pEliminados = parseFloat((((this.totalEliminados - this.tendenciaEliminados) / this.tendenciaEliminados) * 100).toFixed(2));
        if(this.tendenciaEliminados = 0){
          this.pEliminados = 0;
          if(this.pEliminados < 0){
            this.cEliminados = false;
          }
        }
      }
  }

  async getTendenciaComprados() {
    this.tendenciaComprados = 0;
    this.pComprados = 0;
    try {
      const res = await this.estadisticasService.getCountCompradosFecha(this.tendenciaFechaInicio, this.tendenciaFechaFin).toPromise();
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
        contador.value = res.datosContadores[index].totalCount;
        this.tendenciaComprados += parseInt(contador.value);
        await this.getPorcentajeComprados();
      }
    } catch (error) {
      console.error(error);
    }
    if(this.totalComprados){
      this.pComprados = parseFloat((((this.totalComprados - this.tendenciaComprados) / this.tendenciaComprados) * 100).toFixed(2));
      if(this.pComprados < 0){
        this.cComprados = false;
      }
    }
  }


  async procesarDatosPorUltimos7Dias(datos: any) {
    this.xAxisData= [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      this.xAxisData.push(this.obtenerNombreDiaSemana(fecha));
    }
      const valores = new Array(7).fill(0);
    
      const diaSemanaActual = new Date().getDay();
      
      const dataByDayOfWeek = {};
      for (const dato of datos.datosContadores) {
        const fecha = new Date(dato.fecha);
        const diaSemana = fecha.getDay();
        dataByDayOfWeek[diaSemana] = dato.totalCount;
      }
      for (let i = 0; i < 7; i++) {
        const diaSemana = (diaSemanaActual - i + 7) % 7; 
        valores[6 - i] = dataByDayOfWeek[diaSemana] || 0; 
      }
    return valores;
  }
  
  async procesarDatosPorUltimos30Dias(datos: any) {
    let valores = [];
    let dias = [];
    this.xAxisData = [];
  
    const dataByDay = {};
  
    for (const dato of datos.datosContadores) {
      const fecha = new Date(dato.fecha);
      const dia = fecha.getDate(); // Obtener el día del mes
      dataByDay[dia] = dato.totalCount;
    }
  
    // Obtener la fecha de inicio (hace 30 días) y la fecha de fin (hoy)
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 29); // Retroceder 29 días
  
    // Obtener los valores y los días correspondientes
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const dia = fecha.getDate();
      if (dataByDay[dia] !== undefined) {
        valores.push(dataByDay[dia]); // Insertar al final para mantener el orden cronológico
        dias.push(dia); // Insertar al final para mantener el orden cronológico
      } else {
        valores.push(0); // Si no hay datos, agregar un 0
        dias.push(dia); // Insertar el día sin datos
      }
    }
  
    this.xAxisData = dias;

    return valores;
  }
  
  async procesarDatosPorUltimoAno(datos: any) {
    this.xAxisData= [];

    let valores = [];
    const fechaInicio1a = new Date();
      for (let i = 0; i < fechaInicio1a.getMonth() + 1; i++) {
        const fecha = new Date(fechaInicio1a.getFullYear(), i, 1);
        this.xAxisData.push(fecha.toLocaleDateString('es-ES', { month: 'long' }));
      }

    const dataByMonth = {};
  
    for (let index = 0; index < datos.datosContadores.length; index++) {
      const fecha = new Date(datos.datosContadores[index].fecha);
      const mes = fecha.getMonth() + 1; 

      if (!dataByMonth[mes]) {
        dataByMonth[mes] = datos.datosContadores[index].totalCount;
      } else {
        dataByMonth[mes] += datos.datosContadores[index].totalCount;
      }
    }

    const currentMonth = new Date().getMonth() + 1;
    for (let i = 1; i <= currentMonth; i++) {
      let contador = new DatosContadores();
      contador.value = dataByMonth[i] || 0; 
      valores.push(contador.value);
      this.totalActivos += parseInt(contador.value);
    }
    return valores;
  }
}
