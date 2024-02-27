import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor( private http: HttpClient) { 
    this.cargarCabeceras();
  }

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
  getCountAnadidos(): Observable<any>{
    let urlCompleta = this.url + '?nombre=anadido';
    return this.http.get(urlCompleta, {headers: this.cabeceras})
  }

  getCountEliminados(): Observable<any>{
    let urlCompleta = this.url + '?nombre=eliminado';
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getCountSecciones(): Observable<any>{
    let urlCompleta = this.url + '?nombre=secciones';
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getCountAnadidosFecha(inicio: string, fin: string): Observable<any>{
    const fechaInicioCodificada = encodeURIComponent(inicio);
    const fechaFinCodificada = encodeURIComponent(fin);
    let urlCompleta = this.url + '?nombre=anadido&inicio=' + fechaInicioCodificada + '&fin=' + fechaFinCodificada;
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getCountEliminadosFecha(inicio: string, fin: string): Observable<any>{
    const fechaInicioCodificada = encodeURIComponent(inicio);
    const fechaFinCodificada = encodeURIComponent(fin);
    let urlCompleta = this.url + '?nombre=eliminado&inicio=' + fechaInicioCodificada + '&fin=' + fechaFinCodificada;
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getCountQR(): Observable<any>{
    let urlCompleta = this.url + '?nombre=qr';
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  postContador(dataForm: any){
    return this.http.post(this.url, dataForm, {headers: this.cabeceras});
  }

  deleteContador(idCont: string){

    let urlCompleta = this.url + '/' + idCont;

    return this.http.delete( urlCompleta, {headers: this.cabeceras});
  }

  getAllTiempos(): Observable<any>{
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
