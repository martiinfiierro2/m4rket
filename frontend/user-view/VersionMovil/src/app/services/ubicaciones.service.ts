import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { env } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(private http:HttpClient) {}
    private url: string = environment.base_url + '/ubicaciones';
    private url2: string = environment.base_url + '/enubicacion';

    private token: string|any;
    private cabeceras: any;

    //CARGAR CABECERAS
    cargarCabeceras(){
      this.token = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
      this.cabeceras = new HttpHeaders({
        'x-token': this.token
      });
    }

    getIdUbicacion(){
      
    }
}
