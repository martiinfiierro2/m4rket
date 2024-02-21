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
  prodMasAnadido: Producto;
  prodMasEliminado: Producto;
  eliminados: DatosContadores[] = [];
  numQR: any[] = [];
  tiempos: Tiempo[] = [];
  productos: Producto[] = [];
  masAnadido: any;
  masEliminado: any;

  //variables para mostrar foto
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private elementRef: ElementRef,
    private route: Router){
  }

  mostrarGrafico(nombre: string): void {
    let url = '/datos?nombre='+nombre;
    window.location.href = url;
  }  

  ngAfterViewInit(): void {
    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
    this.getQR();
  }

  ngOnInit(): void {
  }

  //CRUD

  getQR(){
    this.estadisticasService.getCountQR().subscribe(res => {
      this.numQR.push(res.datosContadores.qrPorSemana[res.datosContadores.qrPorSemana.length - 1].totalCount);
      this.numQR.push(res.datosContadores.qrPorSemana[res.datosContadores.qrPorSemana.length - 2].totalCount);
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
        if(index == 0){
          this.prodMasAnadido = res2.productos;
          console.log(this.prodMasAnadido);
        }

        contador.nombre = res2.productos.nombre;
        contador.totalCount = res.datosContadores[index].totalCount;
        this.anadidos.push(contador);
      }
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
        if(index == 0){
          this.prodMasEliminado = res2.productos;
          console.log(this.prodMasEliminado);
        }
        contador.nombre = res2.productos.nombre;
        contador.totalCount = res.datosContadores[index].totalCount;
        this.eliminados.push(contador);
      }

    } catch (error) {
      console.error(error);
    }
  }
}
