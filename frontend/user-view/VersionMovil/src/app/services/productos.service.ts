import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  private url: string = environment.base_url + '/productos';
  private urlLista: string = environment.base_url + '/listacompra';

  private token: string | any;
  private cabeceras: any;

  //CREACIÓN CABECERA CON TOKEN USUARIO
  cargarCabeceras() {
    this.token =
      sessionStorage.getItem('tokenUsuario') ||
      localStorage.getItem('tokenUsuario');
    //console.log('El token es: ' + this.token);
    this.cabeceras = new HttpHeaders({
      'x-token': this.token,
    });
    //console.log('La cabecera es: ' + this.cabeceras);
  }

  buscarProductosPorNombre(nombre: string): Observable<any> {
    let urlCompleta = this.url + '?nombre=' + nombre;

    return this.http.get(urlCompleta, { headers: this.cabeceras });
  }
  //CRUD
  getAllProductos(): Observable<any> {
    console.log('getProductos() desde el servicio');

    return this.http.get(this.url, { headers: this.cabeceras });
  }

  getProductoId(idProd: string): Observable<any> {
    this.cargarCabeceras();

    let urlCompleta = this.url + '?id=' + idProd;

    return this.http.get(urlCompleta, { headers: this.cabeceras });
  }

  /*
  getListaCompra(idUsu: string): Observable<any>{
    this.cargarCabeceras();
    let url = this.urlLista+ idUsu;
    return this.http.get(url, {headers: this.cabeceras});
  }
*/
  getListaCompra(idUsu: string): Observable<any> {
    this.cargarCabeceras();
    let urlCompleta = this.urlLista + '?id=' + idUsu;

    return this.http.get(urlCompleta, { headers: this.cabeceras });
  }

  putListaCompra(idLista: string, body: any): Observable<any> {
    this.cargarCabeceras();
    let urlCompleta = `${this.urlLista}/${idLista}`;
    //console.log(`La lista es: ${idLista} y el body es: ${JSON.stringify(body)}`);
    return this.http.put(urlCompleta, body, { headers: this.cabeceras });
  }

  deleteListaCompra(idLista: string) {
    this.cargarCabeceras();
    let urlCompleta = this.urlLista + '/' + idLista;

    return this.http.delete(urlCompleta, { headers: this.cabeceras });
  }

  postListaCompra(body: any) {
    return this.http.post(this.urlLista, body, { headers: this.cabeceras });
  }

  getBusquedaProducto(busqueda: string): Observable<any> {
    this.cargarCabeceras();
    let urlCompleta = this.url + '/' + busqueda;

    return this.http.get(urlCompleta, { headers: this.cabeceras });
  }

  AddValorNumero(i: number) {
    let a = document.getElementById('contador-p');
    if (a) a.innerHTML = '<p>' + 0 + '/' + i + '</p>';
  }
}
