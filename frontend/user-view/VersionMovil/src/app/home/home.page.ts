import { Component, ViewChild } from '@angular/core';
import { ProductosService } from "../services/productos.service";
import { DrawerComponent } from '../components/drawer/drawer.component';
import { environment } from '../environments/environment';
import { getLocaleFirstDayOfWeek } from '@angular/common';

//modelo todo
import * as THREE from 'three'; // we need @types/three for this to work (next to three package)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export interface Producto {
  id: string,
  nombre: string,
  marca: string,
  categoria: string,
  stock: number,
  valor_energetico: Float32Array,
  grasas: Float32Array,
  grasas_saturadas: Float32Array,
  hidratos_carbono: Float32Array,
  azucares: Float32Array,
  fibra: Float32Array,
  proteina: Float32Array,
  sal: Float32Array,
  precio_kg: Float32Array,
  ingerdientes: string,
  foto: string,
  precio: Float32Array,
  //Ubicacions: Ubicaciones[]
  //Promocions: Promociones[]

  cantidad: number,
}

export interface ListaCompra {
  id: string,
  idUsu: string,
  idProd: string,
  fecha: string | null,
  cantidad: number,
}
interface ProductoDetalle {
  nombre: string,
  precio: number,
  foto: string,
  cantidad: number,
  idProducto: string,
  idLista: string,
  contador: boolean,
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  //VERSION ANTIGUA
  productos: Producto[] = [];
  private idUsu: string = '';
  listaCompra: ListaCompra[] = [];

  private idListaUsu: string = '';
  detallesProductos: ProductoDetalle[] = [];


  //PRODUCTO SELECCIONADO
  productoSelect: any;
  dispo: string = '';
  seleccionado: boolean = false;

  //USO DEL DRAWER Y PASO DE INFORMACION
  @ViewChild(DrawerComponent) drawerComponent!: DrawerComponent;

  llamarFuncionDrawer(idProd: string) {
    // Llama a la función del componente Drawer
    //this.drawerComponent.getProducto(producto);
    this.drawerComponent.getProducto(idProd);

  }

  //variables para mostrar foto
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');


  constructor(private productosService: ProductosService) { }


  //VERSION ANTIGUA
  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();
  }


  //FUNCIONES YA CREADAS DE LA ANTIGUA VERSION LISTA DE LA COMPRA
  incrementar(productoDetalle: any) {
    productoDetalle.cantidad++;
    console.log('Nueva cantidad = ' + productoDetalle.cantidad)
    this.actualizarCantidad(productoDetalle.idProducto, productoDetalle.cantidad, productoDetalle.idLista)
  }

  decrementar(productoDetalle: any) {
    console.log('El id de la lista es: ' + productoDetalle.idLista);
    if (productoDetalle.cantidad > 1) {
      productoDetalle.cantidad--;
      console.log('Nueva cantidad = ' + productoDetalle.cantidad)
      this.actualizarCantidad(productoDetalle.idProducto, productoDetalle.cantidad, productoDetalle.idLista)
    } else {
    }
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
  /*
  getProducto(idProd: string){
    this.productosService.getProductoId(idProd).subscribe( result => {
      this.productoSelect = result.productos;
      console.log(this.productoSelect.nombre);
    });
  }
  */
  //Funciones CRUD LISTA COMPRA


  getListaCompraUsu() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) =>
        ({
          idProd: item.idProd,
          cantidad: item.cantidad,
          id: item.id
        }));

        // console.log(this.listaCompra);


        const detallesProductos: ProductoDetalle[] = [];

        this.listaCompra.forEach((productoCompra) => {
          this.getDetalleProducto(productoCompra.idProd, detallesProductos, productoCompra.cantidad, productoCompra.id);
        });
      } else {
        console.error('Error en la búsqueda dentro de lssta compra.');
      }
    });
  }

  getDetalleProducto(idProd: string, detallesProductos: ProductoDetalle[], cantidadProd: number, idLista: string) {
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
      cantidad: nuevaCantidad
    };

    console.log('Cuerpo de la solicitud:', body);

    this.productosService.putListaCompra(idLista, body)
      .subscribe(
        (res) => {
          console.log('Respuesta correcta:', res);
        },
        (error) => {
          console.error('Error en la solicitud PUT: again', error);
        }
      );
  }


  // ESTO ES SOLO MODELO
  container: any; // any  = ugly

  stuff() {
    this.container = document.getElementById('canvas');
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    console.log('inicio stuff');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const loader = new GLTFLoader();

    //camera.position.set(4,10,-6);
    camera.position.set(-40.36, 28.89, 54.87);
    //camera.rotation.set(0.2,2*(Math.PI / 2),0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN //Esto hay que comentarlo
    }

    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    }

    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 3;

    let object;
    let objToRender = 'market';
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(renderer.domElement);
    loader.load(
      `assets/${objToRender}/market.glb`,
      function (glb) {
        object = glb.scene;
        //object.scale.set(2,2,2);
        object.position.set(0, 18, -13);
        //object.position.set(20,-20,-40);
        scene.add(object);
        console.log('se sube');
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.error(error);
      }
    );

    //camera.position.set(0, 1, 1);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.5); // (color, intensity)
    topLight.position.set(200, 200, 200) //top-left-ish
    const topLight2 = new THREE.DirectionalLight(0xffffff, 1.5); // (color, intensity)
    topLight2.position.set(200, 200, -200) //top-left-ish
    const topLight3 = new THREE.DirectionalLight(0xffffff, 1.5); // (color, intensity)
    topLight3.position.set(-200, 200, 200) //top-left-ish

    topLight.castShadow = true;
    scene.add(topLight);
    scene.add(topLight2);
    scene.add(topLight3)
    const ambientLight = new THREE.AmbientLight(0xffffff, 50); // (color, intensity)
    scene.add(ambientLight);



    const clock = new THREE.Clock();
    //Render the scene
    function animate() {
      requestAnimationFrame(animate);
      controls.update();


      // Rotar la esfera
      esfera.rotation.x += 0.05;
      esfera.rotation.y += 0.05;

      renderer.render(scene, camera);
    }

    function obtenerPosicionCamara(camera: THREE.PerspectiveCamera) {
      // Crea un vector para almacenar la posición
      const posicionVector = new THREE.Vector3();

      // Obtiene la posición mundial de la cámara
      camera.getWorldPosition(posicionVector);

      // Devuelve la posición
      return posicionVector;
    }

    // Función para actualizar la posición de la cámara en la consola
    function actualizarPosicion() {
      const posicion = obtenerPosicionCamara(camera);

      // Muestra la posición en la consola
      console.log(
        "Posición de la cámara:",
        posicion.x.toFixed(2),
        posicion.y.toFixed(2),
        posicion.z.toFixed(2)
      );
    }

    // Actualiza la posición de la cámara cada vez que se mueve
    // controls.addEventListener("change", actualizarPosicion);

    // Muestra la posición inicial de la cámara (opcional)
    //actualizarPosicion();


    //Esferas

    const esfera = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x51877A })
    );
    esfera.position.set(-8.1, 21.6, 22.6);
    scene.add(esfera);


    let x = -8.1;
    let y, z = 0;

    for (let j = 0; j <= 1; j++) {
      if (j == 1) {
        x = -8.1;
        const hereda = new THREE.Mesh(
          new THREE.SphereGeometry(0.8, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0x51877A })
        );
        hereda.position.set(-8.1, 21.6, 26.4);
        scene.add(hereda);

      }
      for (let i = 0; i <= 13; i++) {
        // Crea una nueva esfera
        const hereda = new THREE.Mesh(
          new THREE.SphereGeometry(0.8, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0x51877A })
        );

        // Calcula la posición en una secuencia
        if (j == 0) {
          if (i % 2 == 0 && i != 0) {
            x = x + 2.5; // Posiciones en el eje X con una separación de 5
            y = 21.6; // Posición fija en el eje Y
            z = 22.6; // Posición fija en el eje Z
          } else {
            x = x + 2.2; // Posiciones en el eje X con una separación de 5
            y = 21.6; // Posición fija en el eje Y
            z = 22.6; // Posición fija en el eje Z
          }
        } else {
          if (i % 2 == 0 && i != 0) {
            x = x + 2.5; // Posiciones en el eje X con una separación de 5
            y = 21.6; // Posición fija en el eje Y
            z = 26.4; // Posición fija en el eje Z
          } else {
            x = x + 2.2; // Posiciones en el eje X con una separación de 5
            y = 21.6; // Posición fija en el eje Y
            z = 26.4; // Posición fija en el eje Z
          }
        }
        hereda.position.set(x, y, z);

        // Add la esfera a la escena
        scene.add(hereda);
      }
    }

    // funcion de mover el objeto y saber su pos
    function moveSphereWithKeyboard(esfera: THREE.Mesh, renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
      const moveSpeed = 0.1; // Ajusta la velocidad de movimiento

      document.addEventListener('keydown', (event) => {
        const key = event.key;

        switch (key) {
          case 'ArrowUp':
            esfera.position.y += moveSpeed;
            break;
          case 'ArrowDown':
            esfera.position.y -= moveSpeed;
            break;
          case 'ArrowLeft':
            esfera.position.x -= moveSpeed;
            break;
          case 'ArrowRight':
            esfera.position.x += moveSpeed;
            break;
          case 'o': // Mover hacia adelante en Z
            esfera.position.z += moveSpeed;
            break;
          case 'l': // Mover hacia atrás en Z
            esfera.position.z -= moveSpeed;
            break;
        }
        const position = esfera.position;
        console.log(`Posición X: ${position.x.toFixed(2)}`);
        console.log(`Posición Y: ${position.y.toFixed(2)}`);
        console.log(`Posición Z: ${position.z.toFixed(2)}`);
        renderer.render(scene, camera);
      });
    }
    moveSphereWithKeyboard(esfera, renderer, scene);

    animate();







  }







  //FUNCIONES ANTIGUAS CREADAS PARA EL BUSCADOR



}
