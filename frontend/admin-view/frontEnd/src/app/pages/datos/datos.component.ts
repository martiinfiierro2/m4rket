import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import * as echarts from 'echarts';
import { DatosContadores } from '../estadisticas/estadisticas.component';
import { ProductosService } from '../../services/productos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {
  titulo: string = "";
  anadidos: DatosContadores[] = [];
  eliminados: DatosContadores[] = [];
  masAnadido: any;
  masEliminado: any;
  nombre: string;

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private elementRef: ElementRef,
    private route: Router,
    private router: ActivatedRoute){
  }

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
          data: this.anadidos.map(anadido => anadido.name).reverse(),
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
          data: this.anadidos.map(anadido => anadido.value).reverse()
        }
      ]
    };
    this.masAnadido = echarts.init(this.elementRef.nativeElement.querySelector('#cargarDatos'));
    this.masAnadido.setOption(opciones);
  };

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
          data: this.eliminados.map(eliminado => eliminado.name).reverse(),
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
          data: this.eliminados.map(eliminado => eliminado.value).reverse()
        }
      ]
    };
    this.masEliminado = echarts.init(this.elementRef.nativeElement.querySelector('#cargarDatos'));
    this.masEliminado.setOption(opciones);
  };

  async getContadoresMasAnadidos() {
    try {
      const res = await this.estadisticasService.getCountAnadidos().toPromise();
  
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();

        contador.name = res2.productos.nombre;
        contador.value = res.datosContadores[index].totalCount;
        this.anadidos.push(contador);
      }

      //Lamamos al gráfico para cargarlo después de obtener los datos
      this.titulo = "Productos más añadidos";
      this.configurarGraficoAnadidos();
    } catch (error) {
      console.error(error);
    }
  }

  async getContadoresMasEliminados() {
    try {
      const res = await this.estadisticasService.getCountEliminados().toPromise();
      for (let index = 0; index < res.datosContadores.length; index++) {
        let contador = new DatosContadores();
  
        const res2 = await this.productoService.getProductoId(res.datosContadores[index].idProd).toPromise();
        contador.name = res2.productos.nombre;
        contador.value = res.datosContadores[index].totalCount;
        this.eliminados.push(contador);
      }

      //Lamamos al gráfico para cargarlo después de obtener los datos
      this.titulo = "Productos más eliminados";
      this.configurarGraficoEliminados();
    } catch (error) {
      console.error(error);
    }
  }

  ngAfterViewInit(): void {
    this.router.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      console.log(this.nombre);
    });

    if(this.nombre == 'masAnadido'){
      this.getContadoresMasAnadidos();
    }
    else if(this.nombre == 'masEliminado'){
      this.getContadoresMasEliminados();
    }
  }
}
