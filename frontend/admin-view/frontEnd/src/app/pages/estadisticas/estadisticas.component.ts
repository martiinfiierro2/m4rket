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
  contadores: DatosContadores[] = [];
  tiempos: Tiempo[] = [];
  productos: Producto[] = [];

  constructor (
    private estadisticasService: EstadisticasService,
    private productoService: ProductosService,
    private route: Router){
  }

  ngOnInit(): void {
    this.getContadoresMasAnadidos();
  }

  //CRUD
  getContadoresMasAnadidos(){
    this.estadisticasService.getCountAnadidos().subscribe(res =>{
      console.log(res);
      for (let index = 0; index < res.datosContadores.length; index++) {
        this.productoService.getProductoId(res.datosContadores[index].idProd).subscribe(res2 =>{
          const contador = new DatosContadores();
          contador.nombre = res2.productos.nombre;
          contador.totalCount = res.datosContadores[index].totalCount;
          console.log(contador);
          this.contadores.push(contador);
        });
      }
    });

  }
}
