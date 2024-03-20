import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import e from 'express';

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  private token;
  private cabeceras;
  
  constructor( private http: HttpClient) {}

  
  cargarCabecera(){
    this.token = localStorage['tokenUsuario'];
    this.cabeceras = new HttpHeaders({
      'x-token': this.token
    }); 
  }
 

  //CRUDs
  login(formData: any): Observable<any> {

    let urlCompleta = environment.base_url + '/login';
    
    return this.http.post(urlCompleta, formData);
  }

  registro(datosFormulario: any): Observable<any>{

    let urlCompleta = environment.base_url + '/usuarios';

    return this.http.post(urlCompleta, datosFormulario);
  }

  getUsuario(idUsu: string): Observable<any>{

    this.cargarCabecera();

    let urlCompleta = environment.base_url + '/usuarios?id=' + idUsu;

    return this.http.get(urlCompleta, { headers: this.cabeceras});
  }

  validarToken(){
    const urlCompleta = environment.base_url + '/token';  

    this.cargarCabecera();
  
    if (this.token === '') {
      return  of(false);
    }
    else{
      return this.http.get(urlCompleta, { headers: this.cabeceras})
            .pipe(
              tap( res =>{
                  console.log("Actualizo token con: ", res);
                  localStorage.setItem("tokenUsuario", res['token']);
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

  getUsuarios(): Observable<any>{
    return this.http.get(environment.base_url + '/usuarios', {headers: this.cabeceras});
  }

  crearUsuario( datosForm){
    return this.http.post(environment.base_url + '/usuarios', datosForm, { headers: this.cabeceras});
  }

  borrarUsuario( idUsu: number){
    return this.http.delete(environment.base_url + '/usuarios/' + idUsu , {headers: this.cabeceras});
  }

}
