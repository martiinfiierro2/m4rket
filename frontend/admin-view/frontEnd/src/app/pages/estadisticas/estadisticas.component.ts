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
  //Fitro fechas
  fechaInicio: string="";
  fechaFin: string="";

  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private elementRef: ElementRef,
    private route: Router){
  }
/*
  mostrarGrafico(nombre: string): void {
    let url = '/datos?nombre='+nombre;
    window.location.href = url;
  }
*/
  ngOnInit(): void {
   // this.getContadoresMasAnadidos();
   // this.getContadoresMasEliminados();
   // this.getUsuariosActivos();
   this.pruebaGrafico();
  }
  
  private pruebaGrafico() {
    const chartElement = document.getElementById('deleted');
  
    if (chartElement && chartElement.clientWidth > 0 && chartElement.clientHeight > 0) {
      const myChart = echarts.getInstanceByDom(chartElement) || echarts.init(chartElement);
  
      const option: any = {
        xAxis: {
          type: 'category',
          data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
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
            data: [65, 59, 80, 81, 56, 55, 80],
            fill: false,
            borderColor: 'rgb(60, 179, 113)',
            tension: 0.9
          }
        ]
      };
  
      myChart.setOption(option);
    } else {
      console.warn('El elemento "deleted" no tiene un tamaño válido para mostrar el gráfico.');
    }
  }
  
  
  private configurarGraficoEliminados(): void {

    var deleted = document.getElementById('deleted');
    let opciones = {
      title: {
        text: 'Productos más eliminados',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Veces añadido',
          type: 'pie',
          radius: '50%',  
         // data: this.eliminados.reverse(),
          data: 30,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.masEliminado = echarts.init(deleted);
    this.masEliminado.setOption(opciones);
  }
/*
  private configurarGraficoAnadidos(): void {
    let opciones = {
      title: {
        text: 'Productos más anadidos',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Veces añadido',
          type: 'pie',
          radius: '50%',
          data: this.anadidos.reverse(),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.masAnadido = echarts.init(this.elementRef.nativeElement.querySelector('#masAnadidos'));
    this.masAnadido.setOption(opciones);
  }

  //CRUD
  async getContadoresMasAnadidos() {
    this.anadidos = [];
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
        }
        this.configurarGraficoAnadidos();
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
          contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.anadidos.push(contador);
        }
        this.configurarGraficoAnadidos();
      } catch (error) {
        console.error(error);
      }
    }
  }

  getUsuariosActivos(){
    let res = this.estadisticasService.getUsuariosActivos().subscribe( res => {
      this.usuariosActivos = res.usuariosActivos;
    });
  }

  async getContadoresMasEliminados() {
    this.eliminados = [];
    if(this.fechaFin !== "" && this.fechaInicio !== ""){
      try {
        const res = await this.estadisticasService.getCountEliminadosFecha(this.fechaInicio, this.fechaFin).toPromise();
        console.log(res);
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
          contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.eliminados.push(contador);
        }
        this.configurarGraficoEliminados();
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
          contador.name = res2.productos.nombre;
          contador.value = res.datosContadores[index].totalCount;
          this.eliminados.push(contador);
        }
        console.log(this.eliminados);
        this.configurarGraficoEliminados();
      } catch (error) {
        console.error(error);
      }
    }
  }

  filtrar(){
    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
  }
  */
}
