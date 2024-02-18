import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from "../productos/productos.component";
import { PromocionesService } from '../../services/promociones.service';
import { Promocion } from '../promociones/promociones.component';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { Ubicacion } from '../ubicaciones/ubicaciones.component';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaginationComponent } from "../../pagination/pagination.component";
import { UsuariosService } from '../../services/usuarios.service';

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
  numQR: number[] = [];
  tiempos: Tiempo[] = [];
  productos: Producto[] = [];

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private route: Router){
  }

  ngOnInit(): void {
    this.getContadoresMasAnadidos();
    this.getContadoresMasEliminados();
    this.getQR();
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
    // Calcula la diferencia entre los dos valores
    const diferencia = valorFinal - valorInicial;
  
    // Calcula el porcentaje de cambio
    const porcentajeCambio = (diferencia / valorInicial) * 100;
  
    // Retorna el resultado
    this.numQR.push(porcentajeCambio);
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
    } catch (error) {
      console.error(error);
    }
  }
}
