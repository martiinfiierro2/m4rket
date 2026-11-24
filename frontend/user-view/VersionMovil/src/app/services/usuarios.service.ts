import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  private token: string | any;
  private cabeceras: any;

  private url: string = environment.base_url;

  //CREACIÓN CABECERA CON TOKEN USUARIO
  cargarCabeceras() {
    this.token =
      sessionStorage.getItem('tokenUsuario') ||
      localStorage.getItem('tokenUsuario');

    this.cabeceras = new HttpHeaders({
      'x-token': this.token,
    });
  }

  //CRUDs
  login(formData: any): Observable<any> {
    return this.http.post(this.url + '/login', formData);
  }

  registro(datosFormulario: any): Observable<any> {
    return this.http.post(this.url + '/usuarios', datosFormulario);
  }

  getUsuario(idUsu: string): Observable<any> {
    let urlCompleta = this.url + '/usuarios/?id=' + idUsu;

    return this.http.get(urlCompleta, { headers: this.cabeceras });
  }

  validarToken(){
    const urlCompleta = environment.base_url + '/token';  

    this.cargarCabeceras();
  
    if (!this.token) {
      return  of(false);
    }
    else{
      return this.http.get(urlCompleta, { headers: this.cabeceras})
            .pipe(
              tap( res =>{
                  console.log("Actualizo token con: ", res);
                  if ('token' in res) {
                    let tokenBueno = '' + res.token;
                    localStorage.setItem("tokenUsuario", tokenBueno);
                    if (sessionStorage.getItem("tokenUsuario")) {
                      sessionStorage.setItem("tokenUsuario", tokenBueno);
                    }
                  }
              }),
              map( resp =>{
                return true;
              }),
              catchError( err => {
                console.warn(err);
                return of(false);
              })
            );
    }  
  }
}
