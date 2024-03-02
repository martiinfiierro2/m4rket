import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor( private http: HttpClient) { }

  private url: string = environment.base_url + '/ubicaciones';

  private token = localStorage.getItem('tokenUsuario');
  private cabeceras = new HttpHeaders({
    'x-token': this.token
  });;

  //CRUD
  getAllUbicaciones(): Observable<any>{

    let urlCompleta = this.url + '?desde=0';

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  deleteUbicacion(idUbi: string){

    let urlCompleta = this.url + '/' + idUbi;

    return this.http.delete( urlCompleta, {headers: this.cabeceras});
  }

  postUbicacion(dataForm: any){
    return this.http.post(this.url, dataForm, {headers: this.cabeceras});
  }

  postUbicacionProducto(datos: any){

    let urlCompleta = environment.base_url + '/enubicacion';

    return this.http.post(urlCompleta, datos, {headers: this.cabeceras});
  }

}
