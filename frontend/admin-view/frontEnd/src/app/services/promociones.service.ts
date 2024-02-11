import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  constructor( private http: HttpClient) { }

  private url: string = environment.base_url + '/promociones';

  private token: string|any;

  private cabeceras: any;

  //CARGA CABECERA CON TOKEN USUARIO
  cargarCabeceras(){
    this.token = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');

    this.cabeceras = new HttpHeaders({
      'x-token': this.token
    });
  }


  //CRUD
  getAllPromociones(): Observable<any>{
    
    return this.http.get(this.url, {headers: this.cabeceras});
  }

  getPromocionId(idProd: string): Observable<any>{
    let urlCompleta = this.url + '?id=' + idProd;

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  postPromociones(datosFormulario: any){
    return this.http.post( this.url, datosFormulario, {headers: this.cabeceras});
  }

  deletePromociones(idPromo:string){
    let urlCompleta = this.url+'/'+idPromo;
  
    return this.http.delete(urlCompleta, {headers: this.cabeceras});
  }

  editPromocion(idPromo: any, datosFormulario: any){
    let urlCompleta = this.url + '/' + idPromo;
    console.log(urlCompleta);

    return this.http.put(urlCompleta, datosFormulario, {headers: this.cabeceras});
  }



  postTipoPromocion(datosFormulario: any){
    let urlCompleta = environment.base_url + '/tipopromo';

    return this.http.post(urlCompleta, datosFormulario, {headers: this.cabeceras})
  }

  getAllTipoPromociones(): Observable<any>{
    let urlCompleta = environment.base_url + '/tipopromo';

    return this.http.get(urlCompleta, {headers: this.cabeceras})
  }

  postPromocionProducto(datos: any){

    let urlCompleta = environment.base_url + '/enpromocion';

    return this.http.post(urlCompleta, datos, {headers: this.cabeceras});
  }

  
  updatePromocionProducto(datosFormulario: any, id: any){

    let urlCompleta = environment.base_url + '/enpromocion/' + id;

    return this.http.put(urlCompleta, datosFormulario, {headers: this.cabeceras});
  }



}
