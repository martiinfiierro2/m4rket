
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor( private http: HttpClient) {}

  private url: string = environment.base_url + '/contadores';
  private url2: string = environment.base_url + '/tiempos';

  private token: string|any;
  private cabeceras: any;

  //CREACIÓN CABECERA CON TOKEN USUARIO
  cargarCabeceras(){
    this.token =  localStorage.getItem('tokenUsuario');
    //console.log('El token es: ' + this.token);
    this.cabeceras = new HttpHeaders({
      'x-token': this.token
    });
    //console.log('La cabecera es: ' + this.cabeceras);
  }

  
  //CRUD
  getUsuariosActivos(): Observable<any> {
    let urlCompleta = environment.base_url + '/usuarios-activos';
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

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


  getCountBuscadosFecha(inicio: string, fin: string, idUsu: string): Observable<any>{
    this.cargarCabeceras();
    const fechaInicioCodificada = encodeURIComponent(inicio);
    const fechaFinCodificada = encodeURIComponent(fin);
    const UsuCodificado = encodeURIComponent(idUsu);
    let urlCompleta = this.url + '?nombre=buscadousu&inicio=' + fechaInicioCodificada + '&fin=' + fechaFinCodificada + '&idUsu=' + UsuCodificado;
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  postContador(body: any){
    this.cargarCabeceras();
    return this.http.post(this.url, body, {headers: this.cabeceras}).subscribe(
      (res) => {
        //console.log('Respuesta correcta:', res);
      },
      (error) => {
        console.error('Error en la solicitud Post: again', error);
      }
    );
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
