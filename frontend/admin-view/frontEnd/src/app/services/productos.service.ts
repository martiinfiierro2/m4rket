import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ProductosService {

  constructor( private http: HttpClient) { }

  private url: string = 'http://localhost:3000/api/productos';

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
  getAllProductos(): Observable<any>{
    console.log("getProductos() desde el servicio");
    
    return this.http.get(this.url, {headers: this.cabeceras});
  }

  getProductoId(idProd: string): Observable<any>{
    let urlCompleta = this.url + '?id=' + idProd; 

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getProductoOrdenado(criterioOrdenacion: string): Observable<any>{
    let urlCompleta = this.url + '/' + criterioOrdenacion;

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getBusquedaProducto(busqueda: string): Observable<any>{
    let urlCompleta = this.url + '/' + busqueda;

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  deleteProducto(idProd: string){
    let urlCompleta = this.url+'/'+idProd;    
    
    return this.http.delete(urlCompleta, {headers: this.cabeceras});
  }

  postProducto(datosFormulario: any){
    
    console.log("Datos que llegan al servicio: ", datosFormulario);
    
    return this.http.post(this.url, datosFormulario, {headers: this.cabeceras} );
  }

  putProducto(datosFormulario: any, idProd: string){
    let urlCompleta = this.url + '/' + idProd;

    return this.http.put(urlCompleta, datosFormulario, {headers: this.cabeceras});
  }

  
  postFotoProducto(srcFoto:string, idProducto: string){

    return this.http.post('http://localhost:3000/api/uploads/fotoproducto' + idProducto, srcFoto, {headers: this.cabeceras});
  }
  

}
