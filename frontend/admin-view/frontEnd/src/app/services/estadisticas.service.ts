import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor( private http: HttpClient) { }

  private url: string = environment.base_url + '/contadores';
  private url2: string = environment.base_url + '/tiempos';

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
  getAllContadores(): Observable<any>{
    return this.http.get(this.url, {headers: this.cabeceras});
  }

  postContador(dataForm: any){
    return this.http.post(this.url, dataForm, {headers: this.cabeceras});
  }

  deleteContador(idCont: string){

    let urlCompleta = this.url + '/' + idCont;

    return this.http.delete( urlCompleta, {headers: this.cabeceras});
  }

  getAllTimepos(): Observable<any>{
    return this.http.get(this.url2, {headers: this.cabeceras});
  }

  postTiempo(dataForm: any){
    return this.http.post(this.url2, dataForm, {headers: this.cabeceras});
  }

  deleteTimepo(idTime: string){

    let urlCompleta = this.url2 + '/' + idTime;

    return this.http.delete( urlCompleta, {headers: this.cabeceras});
  }
}
