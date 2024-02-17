import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ProductosService } from '../../services/productos.service';
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
  id_Prod: number,
  qr: number
  fecha: Date,
}

export interface Tiempo{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_Lista: number,
  id_Usu: number

}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, PaginationComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})

export class EstadisticasComponent {
  contadores: Contador[] = [];
  tiempos: Tiempo[] = [];

  constructor (
    private estadisticasService: EstadisticasService,
    private route: Router){
  }

  ngOnInit(): void {
    this.getContadores();
  }

  //CRUD
  getContadores(){
    this.estadisticasService.getAllContadores().subscribe(res =>{
      this.contadores = res.datos_contadores;
      console.log(res);
    })
  }
}
