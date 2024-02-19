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
  nombre: string;
  totalCount: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, PaginationComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})

export class EstadisticasComponent {
  anadidos: DatosContadores[] = [];
  eliminados: DatosContadores[] = [];
  numQR: any[] = [];
  tiempos: Tiempo[] = [];
  productos: Producto[] = [];
  masAnadido: any;
  masEliminado: any;

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private elementRef: ElementRef,
    private route: Router){
  }

  ngAfterViewInit(): void {
    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
    this.getQR();
  }

  private configurarGraficoEliminados(): void {
    const opciones = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: this.eliminados.map(eliminado => eliminado.nombre).reverse(),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      series: [
        {
          name: 'Veces eliminado',
          type: 'bar',
          barWidth: '60%',
          data: this.eliminados.map(eliminado => eliminado.totalCount).reverse()
        }
      ]
    };
    this.masEliminado = echarts.init(this.elementRef.nativeElement.querySelector('#masEliminado'));
    this.masEliminado.setOption(opciones);
  };

  private configurarGraficoAnadidos(): void {
      const opciones = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: this.anadidos.map(anadido => anadido.nombre).reverse(),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        series: [
          {
            name: 'Veces añadido',
            type: 'bar',
            barWidth: '60%',
            data: this.anadidos.map(anadido => anadido.totalCount).reverse()
          }
        ]
      };
  
    this.masAnadido = echarts.init(this.elementRef.nativeElement.querySelector('#masAnadido'));
    this.masAnadido.setOption(opciones);
  };
  

  ngOnInit(): void {
  }

  //CRUD

  getQR(){
    this.estadisticasService.getCountQR().subscribe(res => {
      this.numQR.push(res.datosContadores.qrEstaSemana);
      this.numQR.push(res.datosContadores.qrSemanaPasada);
      console.log(res);
      console.log(this.numQR);
      this.calcularCambioPorcentual(this.numQR[0], this.numQR[1]);
    });
  }

  calcularCambioPorcentual(valorInicial: number, valorFinal: number){
    const despejarX = ((valorInicial - valorFinal)/valorFinal).toFixed(2);
    this.numQR.push(despejarX);
  }

  async getContadoresMasAnadidos() {
    try {
      const res = await this.estadisticasService.getCountAnadidos().toPromise();
  
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
        contador.nombre = res2.productos.nombre;
        contador.totalCount = res.datosContadores[index].totalCount;
        this.anadidos.push(contador);
      }

      //Lamamos al gráfico para cargarlo después de obtener los datos
      this.configurarGraficoAnadidos();
    } catch (error) {
      console.error(error);
    }
  }

  async getContadoresMasEliminados() {
    try {
      const res = await this.estadisticasService.getCountEliminados().toPromise();
      console.log(res);
  
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
        contador.nombre = res2.productos.nombre;
        contador.totalCount = res.datosContadores[index].totalCount;
        this.eliminados.push(contador);
      }

      //Lamamos al gráfico para cargarlo después de obtener los datos
      this.configurarGraficoEliminados();
    } catch (error) {
      console.error(error);
    }
  }
}
