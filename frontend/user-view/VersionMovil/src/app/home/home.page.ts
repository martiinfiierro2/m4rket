import { Component, ViewChild } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { environment } from '../environments/environment';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { EstadisticasService } from '../services/estadisticas.service';
import { UbicacionesService } from '../services/ubicaciones.service';
import { json } from 'express';
import { forkJoin } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  comprado: boolean;

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
  comprado: boolean[] = [];
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
  mostrarPantallaCarga: boolean = false;
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

  constructor(private productosService: ProductosService) {
    this.scene = new THREE.Scene();
    this.primeravez = true;
  }

  ngAfterViewInit(): void {}

  //VERSION ANTIGUA
  ngOnInit(): void {
    this.mostrarPantallaCarga = true;
    this.getUsuarioLog();
    this.CargarModelo();
    this.RecargarModelo();
    //this.loadChatbotScript();
  }
  borrarProductosCompradosEnServidorHome(){
    this.drawerComponent.borrarProductosCompradosEnServidor();
  }
  BorrarListaCompraCompleta() {
    this.drawerComponent.borrarTodaLaLista();
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

  eliminar(productoDetalle: any) {
    this.borrarProd(productoDetalle.idLista);
  }

  getUsuarioLog() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (idUsuario !== null) {
      this.idUsu = idUsuario;
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
  }

  //Funciones CRUD LISTA COMPRA

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

    this.productosService.putListaCompra(idLista, body).subscribe(
      (res) => {},
      (error) => {
        console.error('Error en la solicitud PUT: again', error);
      }
    );
  }

  //! MODELO
  container: any;
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
  A13: THREE.Object3D[] = []; // Estanterías finas altas
  A14: THREE.Object3D[] = []; // Estanterías grandes
  A15: THREE.Object3D[] = []; // Estantería Frío
  A1c: THREE.Object3D[] = []; // Estanter
  A2c: THREE.Object3D[] = []; // Frutas 2
  A3c: THREE.Object3D[] = []; // Pasillo1.1
  A4c: THREE.Object3D[] = []; // Pasillo1.2
  A5c: THREE.Object3D[] = []; // Pasillo 2.1
  A6c: THREE.Object3D[] = []; // Pasillo 2.2
  A7c: THREE.Object3D[] = []; // Pasillo 3.1
  A8c: THREE.Object3D[] = []; // Pasillo 3.2
  A9c: THREE.Object3D[] = []; // Pasillos pegados 1.1
  A10c: THREE.Object3D[] = []; // Pasillos pegados 1.2
  A11c: THREE.Object3D[] = []; //Pasillos pegados 2.1
  A12c: THREE.Object3D[] = []; // Pasillos pegados 2.2
  A13c: THREE.Object3D[] = []; // Estanterías finas altas
  A14c: THREE.Object3D[] = []; // Estanterías grandes
  A15c: THREE.Object3D[] = []; // Estantería Frío
  primeravez: boolean;

  CargarModelo() {
    this.primeravez = false;
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

    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);

    //cargarPointers
    this.modeloService.cargarPointers(
      this.scene,
      this.A1c,
      this.A2c,
      this.A3c,
      this.A4c,
      this.A5c,
      this.A6c,
      this.A7c,
      this.A8c,
      this.A9c,
      this.A10c,
      this.A11c,
      this.A12c,
      this.A13c,
      this.A14c,
      this.A15c,
      self,
      this.camera,
      this.imagenescarrito,
      true,
      this.idsauxiliares,
      this.ref,
      this.pos,
      this.comprado
    );

    this.modeloService.cargarCasters(
      this.scene,
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
      this.A13,
      this.A14,
      this.A15,
      self,
      this.camera,
      this.imagenescarrito
    );
    let intersectedObjectsMap = new Map<THREE.Object3D, THREE.Object3D>();

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
        let objectFound = false;

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
          self.A13,
          self.A14,
          self.A15
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
                  self.A13,
                  self.A14,
                  self.A15
                );
                const position = objectArray.indexOf(object);
                console.log(arrayName, position);
                //Busco la relacion con produtos
                self.getIdUbicacion(arrayName, position);
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
      this.A1c,
      this.A2c,
      this.A3c,
      this.A4c,
      this.A5c,
      this.A6c,
      this.A7c,
      this.A8c,
      this.A9c,
      this.A10c,
      this.A11c,
      this.A12c,
      this.A13c,
      this.A14c,
      this.A15c
    );
  }
   recargandoModelo = false;
   async RecargarModelo() {
    if (this.recargandoModelo) {
      console.log('RecargarModelo ya está en proceso...');
      return;
    }
  
    // Marcar que RecargarModelo está en proceso de ejecución
    this.recargandoModelo = true;
  
    try {
      // Obtener la lista de compra
      await this.limpiarDatos();
      // Obtener la lista de compra
      await this.getListaCompraUsu();
      // Obtener las imágenes de los productos y sus ubicaciones
      await this.getProductosIMG();
      await this.getTodasUbicacionesLista();


      // Cargar los pointers del modelo
      await this.modeloService.cargarPointers(
        this.scene,
        this.A1c,
        this.A2c,
        this.A3c,
        this.A4c,
        this.A5c,
        this.A6c,
        this.A7c,
        this.A8c,
        this.A9c,
        this.A10c,
        this.A11c,
        this.A12c,
        this.A13c,
        this.A14c,
        this.A15c,
        self,
        this.camera,
        this.imagenescarrito,
        false,
        this.idsauxiliares,
        this.ref,
        this.pos,
        this.comprado
      );
      // Restablecer la variable de estado a false para permitir futuras llamadas
      this.recargandoModelo = false;
      this.mostrarPantallaCarga = false;

    } catch (error) {
      console.error('Error al recargar el modelo:', error);
      // Asegúrate de restablecer la variable de estado incluso en caso de error
      this.recargandoModelo = false;
    }






   }


   

  // async RecargarModelo() {
  //   try {
  //     await this.limpiarDatos();
  //     // Obtener la lista de compra
  //     await this.getListaCompraUsu();
  //     // Obtener las imágenes de los productos y sus ubicaciones
  //     await this.getProductosIMG();
  //     await this.getTodasUbicacionesLista();


  //     // Cargar los pointers del modelo
  //     await this.modeloService.cargarPointers(
  //       this.scene,
  //       this.A1c,
  //       this.A2c,
  //       this.A3c,
  //       this.A4c,
  //       this.A5c,
  //       this.A6c,
  //       this.A7c,
  //       this.A8c,
  //       this.A9c,
  //       this.A10c,
  //       this.A11c,
  //       this.A12c,
  //       this.A13c,
  //       this.A14c,
  //       this.A15c,
  //       self,
  //       this.camera,
  //       this.imagenescarrito,
  //       false,
  //       this.idsauxiliares,
  //       this.ref,
  //       this.pos,
  //       this.comprado
  //     );
  //     this.mostrarPantallaCarga = false;
  //   } catch (error) {
  //     console.error('Error al recargar el modelo:', error);
  //   }
  // }
  async limpiarDatos() {
    this.comprado = [];
    this.imagenescarrito = [];
    this.ref = [];
    this.pos = [];
    this.idsauxiliares = [];
  }

  async getProductosIMG() {
    try {
      let tokenUsuario =
        sessionStorage.getItem('tokenUsuario') ||
        localStorage.getItem('tokenUsuario');
      let urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';
      await Promise.all(
        this.listaCompra.map(async (item) => {
          const res: any = await this.productosService
            .getProductoId(item.idProd)
            .toPromise();
          this.fotosdecarrito.push(
            urlFotoProducto + res.productos.foto + '?token=' + tokenUsuario
          );
          this.imagenescarrito.push(res.productos);

          // Registro de depuración
        })
      );
    } catch (error) {
      console.error('Error al obtener imágenes de productos:', error);
    }
  }

  async getTodasUbicacionesLista() {
    try {
      this.ref=[]
      for (const item of this.listaCompra) {
        const res: any = await this.productosService.getProductoId(item.idProd).toPromise();
        res.productos.Ubicacions.forEach((ubicacion: any) => {
          this.ref.push(ubicacion.referencia);
          this.pos.push(ubicacion.posicion);
          this.idsauxiliares.push(res.productos.id);
        });
      }
    } catch (error) {
      console.error('Error al obtener ubicaciones de productos:', error);
    }
  }
  

  getListaCompraUsu() {
    return new Promise<void>((resolve, reject) => {
      this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
        if (result.listacompra) {
          this.listaCompra = result.listacompra.map((item: ListaCompra) => ({
            idProd: item.idProd,
            cantidad: item.cantidad,
            id: item.id,
            comprado: item.comprado,
          }));
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
          for (let i = 0; i < this.listaCompra.length; i++) {
            if (this.listaCompra[i].comprado == true) {
              this.comprado.push(true);
            } else {
              this.comprado.push(false);
            }
          }
          resolve();
        } else {
          console.error('Error en la búsqueda dentro de lssta compra.');
        }
      });
    });
  }

  //!Chatbot!!!
  loadChatbotScript() {
    const script = document.createElement('script');
    script.src =
      'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.onload = () => {};
    document.body.appendChild(script);
  }
}
