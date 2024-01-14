import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor( private http: HttpClient) { }

  private url: string = 'http://localhost:3000/api/ubicaciones';

  private token: string|any;
  private cabeceras: any;
  

  //CREACIÓN CABECERA CON TOKEN USUARIO
  cargarCabeceras(){
    this.token = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');

    this.cabeceras = new HttpHeaders({
      'x-token': this.token
    });
  }


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

    return this.http.post('http://localhost:3000/api/enubicacion', datos, {headers: this.cabeceras});
  }

}
