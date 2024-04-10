import { Component, ViewChild } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { environment } from '../environments/environment';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { EstadisticasService } from '../services/estadisticas.service';
import { UbicacionesService } from '../services/ubicaciones.service';
import { json } from 'express';
import { forkJoin } from 'rxjs';

//modelo todo
import * as THREE from 'three'; // we need @types/three for this to work (next to three package)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { ModeloService } from '../services/modelo.service';

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  stock: number;
  valor_energetico: Float32Array;
  grasas: Float32Array;
  grasas_saturadas: Float32Array;
  hidratos_carbono: Float32Array;
  azucares: Float32Array;
  fibra: Float32Array;
  proteina: Float32Array;
  sal: Float32Array;
  precio_kg: Float32Array;
  ingerdientes: string;
  foto: string;
  precio: Float32Array;
  //Ubicacions: Ubicaciones[]
  //Promocions: Promociones[]

  cantidad: number;
}

export interface ListaCompra {
  id: string;
  idUsu: string;
  idProd: string;
  fecha: string | null;
  cantidad: number;
  comprado: boolean;
}
interface ProductoDetalle {
  nombre: string;
  precio: number;
  foto: string;
  cantidad: number;
  idProducto: string;
  idLista: string;
  contador: boolean;
}

interface Stats {
  nombre: string;
  idProd: number;
  qr: string | null;
  fecha: Date;
}

export interface Ubicacion {
  id: number;
  referencia: string;
  posicion: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  //VERSION ANTIGUA
  productos: Producto[] = [];
  ubicaciones: Ubicacion[] = [];
  private idUsu: string = '';
  listaCompra: ListaCompra[] = [];

  private idListaUsu: string = '';
  detallesProductos: ProductoDetalle[] = [];
  ProductoUbiListaCompra: Producto[] = [];
  ref: string[] = [];
  pos: number[] = [];
  idsauxiliares: number[] = [];
  fotosdecarrito: string[] = [];
  imagenescarrito: Producto[] = [];


  //PRODUCTO SELECCIONADO
  productoSelect: any;
  dispo: string = '';
  seleccionado: boolean = false;
  productoInfo: any;
  modeloService = new ModeloService();
  totalProductos: number = 0;
  totalComprados: number = 0;
  
  //USO DEL DRAWER Y PASO DE INFORMACION
  @ViewChild(DrawerComponent) drawerComponent!: DrawerComponent;

  llamarFuncionDrawer(idProd: string) {
    // Llama a la función del componente Drawer
    //this.drawerComponent.getProducto(producto);
    this.drawerComponent.getProducto(idProd);
  }
  scene: THREE.Scene;

  //variables para mostrar foto
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';
  tokenUsuario =
    sessionStorage.getItem('tokenUsuario') ||
    localStorage.getItem('tokenUsuario');


  constructor(private productosService: ProductosService,
    private estadisticasService: EstadisticasService, 
    private ubicacionesService: UbicacionesService) {this.scene = new THREE.Scene();}
    
  ngAfterViewInit(): void {
  }

  //VERSION ANTIGUA
  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();
  }

  //Funciones para sacar el valor de los productos a partit de la ubicacion del motor gráfico
  getIdUbicacion(referencia: any, posicion: any) {
    for (let index = 0; index < this.listaCompra.length; index++) {
      this.productosService
        .getProductoId(this.listaCompra[index].idProd)
        .subscribe((res) => {
          for (let j = 0; j < res.productos.Ubicacions.length; j++) {
            if (
              res.productos.Ubicacions[j].referencia == referencia &&
              res.productos.Ubicacions[j].posicion == posicion
            ) {
              this.llamarFuncionDrawer(res.productos.id);
            }
          }
        });
    }
  }

  getTodasUbicacionesLista() {

    const observables = [];
    for (let i = 0; i < this.listaCompra.length; i++) {
      observables.push(
        this.productosService.getProductoId(this.listaCompra[i].idProd)
      );
      console.log(this.listaCompra[i]);
    }

    forkJoin(observables).subscribe((respuestas: any[]) => {
      respuestas.forEach((res) => {
        for (let j = 0; j < res.productos.Ubicacions.length; j++) {
          this.ref.push(res.productos.Ubicacions[j].referencia);
          this.pos.push(res.productos.Ubicacions[j].posicion);
          this.idsauxiliares.push(res.productos.id);
        }
      });

      // Ahora que los datos están disponibles, llamamos a CargarModelo()
      this.CargarModelo();
    });
  }

  // FUNCIONES YA CREADAS DE LA ANTIGUA VERSION LISTA DE LA COMPRA
  incrementar(productoDetalle: any) {
    productoDetalle.cantidad++;
    console.log('Nueva cantidad = ' + productoDetalle.cantidad);
    this.actualizarCantidad(
      productoDetalle.idProducto,
      productoDetalle.cantidad,
      productoDetalle.idLista
    );
    let tipo = 'anadido';
    let fecha = new Date();
    this.estadistica(productoDetalle.idProducto, tipo, fecha);
  }

  // Estadisticas
  estadistica(id: any, tipo: any, fecha: any) {
    const post: Stats = {
      nombre: tipo,
      idProd: id,
      qr: null,
      fecha: fecha,
    };
    console.log(post);
    this.estadisticasService.postContador(post);
  }

  decrementar(productoDetalle: any) {
    productoDetalle.cantidad--;
    console.log('Nueva cantidad = ' + productoDetalle.cantidad);
    this.actualizarCantidad(
      productoDetalle.idProducto,
      productoDetalle.cantidad,
      productoDetalle.idLista
    );
    let tipo = 'eliminado';
    let fecha = new Date();
    this.estadistica(productoDetalle.idProducto, tipo, fecha);
  }

  eliminar(productoDetalle: any) {
    this.borrarProd(productoDetalle.idLista);
  }

  getUsuarioLog() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (idUsuario !== null) {
      this.idUsu = idUsuario;
      //console.log('El usuario logueado es: '+ this.idUsu);
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
  }

  //Funciones CRUD LISTA COMPRA

  getListaCompraUsu() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) => ({
          idProd: item.idProd,
          cantidad: item.cantidad,
          id: item.id,
          comprado: item.comprado
        }));

        console.log(this.listaCompra);
        this.getProductosIMG();
        this.getTodasUbicacionesLista();
        const detallesProductos: ProductoDetalle[] = [];

        this.totalProductos = this.listaCompra.length;

        // Contador de productos marcados como comprados
        this.totalComprados = this.listaCompra.reduce((total, item) => {
          return total + (item.comprado ? 1 : 0);
        }, 0);
        this.listaCompra.forEach((productoCompra) => {
          this.getDetalleProducto(
            productoCompra.idProd,
            detallesProductos,
            productoCompra.cantidad,
            productoCompra.id
          );
        });
      } else {
        console.error('Error en la búsqueda dentro de lssta compra.');
      }
    });
  }

  getDetalleProducto(
    idProd: string,
    detallesProductos: ProductoDetalle[],
    cantidadProd: number,
    idLista: string
  ) {
    const quantity = cantidadProd;
    const idP = idProd;
    const idL = idLista;
    let mostrarContador = false;
    if (quantity > 0) {
      mostrarContador = true;
    } else {
      mostrarContador = false;
    }
    this.productosService.getProductoId(idProd).subscribe((producto) => {
      const productoDetalle: ProductoDetalle = {
        nombre: producto.productos.nombre,
        precio: producto.productos.precio,
        foto: producto.productos.foto,
        cantidad: quantity,
        idProducto: idP,
        idLista: idL,
        contador: mostrarContador,
      };
      detallesProductos.push(productoDetalle);

      //console.log('Detalles del producto:', productoDetalle);
      //console.log('Los productos son: ', detallesProductos);

      this.detallesProductos = detallesProductos;
    });
  }
  //Borrar de la lista de la compra
  borrarProd(idLista: string) {
    this.productosService.deleteListaCompra(idLista).subscribe((result) => {
      this.getListaCompraUsu();
    });
  }

  //Actualizar cantidad de producto en la lista

  actualizarCantidad(idProd: string, nuevaCantidad: number, idLista: string) {
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: idProd,
      fecha: fechaActual,
      cantidad: nuevaCantidad,
    };

    console.log('Cuerpo de la solicitud:', body);

    this.productosService.putListaCompra(idLista, body).subscribe(
      (res) => {
        console.log('Respuesta correcta:', res);
      },
      (error) => {
        console.error('Error en la solicitud PUT: again', error);
      }
    );
  }

  getProductosIMG() {
    let tokenUsuario =
      sessionStorage.getItem('tokenUsuario') ||
      localStorage.getItem('tokenUsuario');
    let urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

    for (let index = 0; index < this.listaCompra.length; index++) {
      this.productosService
        .getProductoId(this.listaCompra[index].idProd)
        .subscribe((res) => {
          this.fotosdecarrito.push(urlFotoProducto + res.productos.foto + '?token=' + tokenUsuario)
          this.imagenescarrito.push(res.productos);
          //console.log(
           // urlFotoProducto + res.productos.foto + '?token=' + tokenUsuario
         // );
          console.log(res.productos.Ubicacions[0].referencia);
          //               <img [src]="urlFotoProducto + productoSelect.foto + '?token=' +tokenUsuario" alt="Product Image" />
        });
    }
  }

  //! MODELO
  container: any;
  //scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  A1: THREE.Object3D[] = []; // Frutas 1
  A2: THREE.Object3D[] = []; // Frutas 2
  A3: THREE.Object3D[] = []; // Pasillo1.1
  A4: THREE.Object3D[] = []; // Pasillo1.2
  A5: THREE.Object3D[] = []; // Pasillo 2.1
  A6: THREE.Object3D[] = []; // Pasillo 2.2
  A7: THREE.Object3D[] = []; // Pasillo 3.1
  A8: THREE.Object3D[] = []; // Pasillo 3.2
  A9: THREE.Object3D[] = []; // Pasillos pegados 1.1
  A10: THREE.Object3D[] = []; // Pasillos pegados 1.2
  A11: THREE.Object3D[] = []; //Pasillos pegados 2.1
  A12: THREE.Object3D[] = []; // Pasillos pegados 2.2
  B1: THREE.Object3D[] = []; // Estanterías finas altas
  B2: THREE.Object3D[] = []; // Estanterías grandes
  B3: THREE.Object3D[] = []; // Estantería Frío
  RecargarModelo() {

    //! No funciona hay que arreglar los touch al limpiar la escena y las animaciones
    
    this.modeloService.clearScene(this.scene);
    this.ref.splice(0, this.ref.length); // Elimina todos los elementos de this.ref
    this.pos.splice(0, this.pos.length); // Elimina todos los elementos de this.pos
    this.idsauxiliares.splice(0, this.idsauxiliares.length); // Elimina todos los elementos de this.pos
    this.imagenescarrito.splice(0, this.imagenescarrito.length); // Elimina todos los elementos de this.pos
    
    
    //window.location.reload();
    this.getListaCompraUsu();
  }

  CargarModelo() {
    this.container = document.getElementById('canvas');
    this.container.style.width = '100%';
    this.container.style.height = '100%';

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    this.camera.position.set(-40.36, 28.89, 54.87);
    const controls = new OrbitControls(this.camera, renderer.domElement);
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    let objToRender;
    if (prefersDarkMode) {
      objToRender = 'marketoscuro';
    } else {
      objToRender = 'market';
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);
    //MODELO SUPERMERCADO
    this.modeloService.cargarMercado(this.scene, objToRender);
    //LUCES
    this.modeloService.setupLights(this.scene, prefersDarkMode);
    //CONTROLES
    this.modeloService.configurarControles(controls);

    //Pointers //Indicadores
    let pointerrender = 'pointer';




    const self = this;

    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);

    //cargarPointers
    this.modeloService.cargarPointers(
      this.scene,
      pointerrender,
      this.A1,
      this.A2,
      this.A3,
      this.A4,
      this.A5,
      this.A6,
      this.A7,
      this.A8,
      this.A9,
      this.A10,
      this.A11,
      this.A12,
      this.B1,
      this.B2,
      this.B3,
      self,
      this.camera,
      this.imagenescarrito
    );

    if (this.container) {
      this.container.addEventListener('touchstart', onTouchStart, false);
      const self = this;

      function onTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) {
          return;
        }
        const touch = event.touches[0];
        const rect = self.container!.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((touch.clientX - rect.left) / self.container!.clientWidth) * 2 - 1,
          -((touch.clientY - rect.top) / self.container!.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, self.camera);
        let intersectedObjectsMap = new Map<THREE.Object3D, THREE.Object3D>();
        let objectFound = false;

        // Loop through all arrays (A1 to A6)
        const objectArrays: THREE.Object3D[][] = [
          self.A1,
          self.A2,
          self.A3,
          self.A4,
          self.A5,
          self.A6,
          self.A7,
          self.A8,
          self.A9,
          self.A10,
          self.A11,
          self.A12,
          self.B1,
          self.B2,
          self.B3,
        ];
        for (const objectArray of objectArrays) {
          for (const object of objectArray) {
            const intersects = raycaster.intersectObject(object, true);
            if (intersects.length > 0) {
              intersectedObjectsMap.set(object, intersects[0].object);
              objectFound = true;
              if (objectFound) {
                // Obtener el nombre del array y la posición
                const arrayName = self.modeloService.obtenerNombreArray(
                  objectArray,
                  self.A1,
                  self.A2,
                  self.A3,
                  self.A4,
                  self.A5,
                  self.A6,
                  self.A7,
                  self.A8,
                  self.A9,
                  self.A10,
                  self.A11,
                  self.A12,
                  self.B1,
                  self.B2,
                  self.B3
                );
                const position = objectArray.indexOf(object);

                //Busco la relacion con produtos
                self.getIdUbicacion(arrayName, position);
                console.log(arrayName, position);
              }
              break;
            }
          }
        }
      }
    }

    this.modeloService.animate(
      controls,
      this.scene,
      this.camera,
      renderer,
      this.A1,
      this.A2,
      this.A3,
      this.A4,
      this.A5,
      this.A6,
      this.A7,
      this.A8,
      this.A9,
      this.A10,
      this.A11,
      this.A12,
      this.B1,
      this.B2,
      this.B3
    );
  }
}
