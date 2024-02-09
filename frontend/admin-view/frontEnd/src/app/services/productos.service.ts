import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})


export class ProductosService {

  constructor( private http: HttpClient) { }

  private url: string = environment.base_url  + '/productos';

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
  getAllProductos(desde: number): Observable<any>{
   let urlCompleta = this.url + '?desde=' + desde;
    
    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }

  getProductosPaginacion(desde: number): Observable<any>{
    return this.http.get( this.url + '?desde=' + desde, {headers: this.cabeceras});
  }

  getProductosDatasetPaginacion(desde: number): Observable<any>{
    return this.http.get( environment.base_url + '/dataset/productos?desde=' + desde);
  }

  getAllProductosDataset(): Observable<any>{
    return this.http.get(environment.base_url + '/dataset/productos');
  }


  getProductoId(idProd: string): Observable<any>{
    let urlCompleta = this.url + '?id=' + idProd; 

    return this.http.get(urlCompleta, {headers: this.cabeceras});
  }
  
  getProductioIdDataset(searchIdProd: number): Observable<any>{
    let urlCompleta = environment.base_url + '/dataset/productos' + searchIdProd;

    return this.http.get( urlCompleta );
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

  postProducto(datosFormulario: any): Observable<any>{
    
    return this.http.post(this.url, datosFormulario, {headers: this.cabeceras} );
  }

  putProducto(datosFormulario: any, idProd: string){
    let urlCompleta = this.url + '/' + idProd;

    return this.http.put(urlCompleta, datosFormulario, {headers: this.cabeceras});
  }

  
  postFotoProducto(foto:File, idProducto: string){

    const formData: FormData = new FormData();
    formData.append('archivo', foto, foto.name)  

    return this.http.post(environment.base_url +'/uploads/fotoproducto/' + idProducto, formData, {headers: this.cabeceras});
  }
  

}
