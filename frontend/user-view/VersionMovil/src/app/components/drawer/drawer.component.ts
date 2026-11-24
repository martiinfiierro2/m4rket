import { Component, ElementRef, ViewChild, AfterViewInit, Inject} from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { MotorComponent, motor } from '../motor/motor.component';
import { TRecursoMalla } from '../motor/clases/TRecursoMalla';

import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../environments/environment';
import * as echarts from 'echarts';
import { HomePage } from 'src/app/home/home.page';
import { Malla } from '../motor/clases/Malla';
import { RotacionService } from 'src/app/services/rotacion.service';
import { MotorService } from 'src/app/services/motor.service';

export interface En_ubicacion{
  id: number,
  idProd: number,
  idUbi: number,
  fecha_ini: Date,
  fecha_fin: Date
}

export interface Ubicaciones{
  id: number,
  referencia: string,
  posicion: number,
  en_ubicacion: En_ubicacion
}

export interface Promociones{
  id: number,
  nombre: string,
  fecha_ini: Date,
  fecha_fin: Date,
  id_tipoPromo: number,
  en_promocion: en_Promocion
}

export interface en_Promocion{
  id: string,
  fecha: string,
  precio: Float32Array,
  idPromo: number,
  idProd: number
}

interface lista{
  id: string,
  estado: boolean
}
interface Stats {
  nombre: string;
  idProd: number;
  fecha: Date;
  id_usuario: string;
  tiempo_uso: number;
}
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
  ingredientes: string;
  foto: string;
  precio: Float32Array;
  enListaCompra: boolean;
  idLista: string;
  cantidad: number;
  comprado: boolean;
  //Ubicacions: Ubicaciones[]
  Promocions: Promociones[];
}

export interface ListaCompra {
  id: string;
  idUsu: string;
  idProd: number;
  fecha: string | null;
  cantidad: number;
  comprado: boolean;
}

export class DatosContadores{
  nombre: string = "";
  precio: number = 0;
  id: string ="";
  foto: string = "";
}


@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.3s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DrawerComponent implements AfterViewInit {
  @ViewChild('drawer', { read: ElementRef }) drawer!: ElementRef;
  // @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('botonchatbot', { read: ElementRef }) botonchatbot!: ElementRef;
  @ViewChild('chatbot', { read: ElementRef }) chatbot!: ElementRef;
  @ViewChild('lista', { read: ElementRef }) lista!: ElementRef;
  @ViewChild('profile', { read: ElementRef }) profile!: ElementRef;
  @ViewChild('recarga', { read: HomePage }) recarga!: HomePage;


  isOpen = true;
  openHeight = 0;
  isMiddle = true;
  position = 3;


  //PRODUCTO SELECCIONADO
  productoSelect: Producto | null = null;
  dispo: string = '';
  seleccionado: boolean = false;
  listaCompra: ListaCompra[] = [];

  totalProductos: number = 0;
  totalComprados: number = 0;
  //MODELO
  modeloService = new ModeloService();

  //Para crearPines
  nuevoPin!:lista[];


  //Más buscados
  masBuscados: DatosContadores[] = [];
  buscados: DatosContadores[] = [];
  favoritos: Producto[] = [];
 

  fechaInicio: string="";
  fechaFin: string="";

  async fechasDefecto(){
    const hoy = new Date();
    const fechaInicio = new Date(hoy);
    const fechaFin = new Date(hoy);

    fechaInicio.setDate(fechaInicio.getDate() - 29);

    this.fechaInicio = fechaInicio.toISOString().split('T')[0];
    this.fechaFin = fechaFin.toISOString().split('T')[0];

    await this.getContadoresMasBuscados();

  }

  async getContadoresMasBuscados() {
    this.buscados = [];
    this.favoritos = [];
    if(this.fechaFin !== "" && this.fechaInicio !== ""){
      try {
        const res = await this.estadisticasService.getCountBuscadosFecha(this.fechaInicio, this.fechaFin, this.idUsu).toPromise();
        for (let index = 0; index < res.datosContadores.length; index++) {
          let contador = new DatosContadores();
    
          const res2 = await this.productosService.getProductoId(res.datosContadores[index].idProd).toPromise();
          contador.nombre = res2.productos.nombre;
          contador.precio = res2.productos.precio;
          contador.foto = res2.productos.foto;
          contador.id = res2.productos.id;
          this.buscados.push(contador);
          this.favoritos.push(res2.productos);
        }
        this.compararListaFavoritos();
      } catch (error) {
        console.error(error);
      }
    }
  }
  async compararListaFavoritos() {
    await this.getListaCompraUsu();
    
    this.listaCompra.forEach((productoCompra) => {
      const productoEncontrado = this.favoritos.find(
        (producto) => productoCompra.idProd === parseInt(producto.id)
      );
      if (productoEncontrado) {
        productoEncontrado.enListaCompra = true;
        productoEncontrado.cantidad = productoCompra.cantidad;
        productoEncontrado.idLista = productoCompra.id;
        productoEncontrado.comprado = productoCompra.comprado;
        //console.log(`Producto con id ${productoEncontrado.id} está en la lista y su cantidad es ${productoEncontrado.cantidad}`);
      } else {
        // console.log(`No se encontró el producto con idProd ${productoCompra.idProd} en la lista de productos`);
      }
    });
  }

  //VARIABLES FOTO
  tokenUsuario =
    sessionStorage.getItem('tokenUsuario') ||
    localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  @ViewChild(Malla) malla!: Malla;


  constructor(
    private plt: Platform,
    private gestureCtrl: GestureController,
    private productosService: ProductosService,
    private estadisticasService: EstadisticasService,
    private rotacionService: RotacionService,
    private homeService: HomePage,
    @Inject(MotorService) private motorServicio: MotorService
  ) {
  
  }

  async borrarProductosCompradosEnServidor() {
    const productosComprados = await this.listaCompra.filter(producto => producto.comprado);

    for (const producto of productosComprados) {
        await this.productosService.deleteListaCompra(producto.id).toPromise();
    }

    this.listaCompra = await new Promise((resolve) => {
      resolve(this.listaCompra.filter(producto => !producto.comprado));
    });
    await this.getListaCompraUsu();
    this.refrescarDrawer();

    this.motorServicio.getMotor().eliminarPinesComprados();
  }

  borrarTodaLaLista() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        const listasCompra = result.listacompra;
        const deletePromises = listasCompra.map((listaCompra: any) => {
          return this.productosService.deleteListaCompra(listaCompra.id).toPromise();
        });
  
        Promise.all(deletePromises).then(() => {
          this.getListaCompraUsu();
          this.refrescarDrawer();
          this.motorServicio.getMotor().eliminarTodosPines();
        }).catch((error) => {
        });
      }
    });
  }

  onInputChange(event: Event) {
    const valorRotacion = document.querySelector<HTMLInputElement>('#rotacion');
    const rotation = parseInt(valorRotacion!.value);
    motor.setRotacion(rotation);
  }

  async ngAfterViewInit() {
    const drawer = this.drawer.nativeElement;
    this.openHeight = this.plt.height() / 100;
    const botonchatbot = this.botonchatbot.nativeElement;
    //const chatbot = this.chatbot.nativeElement;
    const profile = this.profile.nativeElement;

    drawer.style.transform = `translateY(500px)`;

    const gesture = await this.gestureCtrl.create({
      el: drawer,
      gestureName: 'swipe',
      direction: 'y',
      onMove: (ev) => {
        //console.log(ev);
        if (ev.deltaY < -this.openHeight || ev.deltaY > this.openHeight) return;
        drawer.style.transform = `translateY(${ev.deltaY}px)`;
      },
      onEnd: (ev) => {
        if (this.isMiddle) {
          if (ev.deltaY < -50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 3}px)`; // Ir a la posición superior
            this.isMiddle = false;
            this.isOpen = true;
            botonchatbot.style.display = 'none';
            profile.style.display = 'none';
            this.position = 1;
          } else if (ev.deltaY > 50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 84}px)`; // Ir a la posición inferior
            this.isMiddle = false;
            this.isOpen = false;
            this.position = 3;
            botonchatbot.style.display = 'flex';
          } else {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
            botonchatbot.style.display = 'flex';
            this.position = 2;
          }
        } else if (this.isOpen) {
          if (ev.deltaY > 50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
            this.isOpen = false;
            this.isMiddle = true;
            this.position = 2;
            botonchatbot.style.display = 'flex';
          }
        } else {
          if (ev.deltaY < -50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
            this.isOpen = true;
            this.isMiddle = true;
            this.position = 2;
            botonchatbot.style.display = 'flex';
          }
        }
      },
    });
    gesture.enable(true);
  }

  toggleDrawer2(position: number) {
    const drawer = this.drawer.nativeElement;
    const botonchatbot = this.botonchatbot.nativeElement;
    // 1 -> Arriba
    // 2 -> Medio
    // 3 -> Abajo
    if (position == 1) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 3}px)`;
      this.isMiddle = false;
      this.isOpen = true;
      this.position = 1;
      botonchatbot.style.display = 'none';
    }
    if (position == 2) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
      this.position = 2;
      botonchatbot.style.display = 'flex';
    }
    if (position == 3) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
      this.position = 3;
      botonchatbot.style.display = 'flex';
    }
  }

  Recarguita() {
    const buttonElement = document.getElementById('Recargar');
    if (buttonElement) {
      buttonElement.dispatchEvent(new Event('click'));
    }
  }

  toggleDrawer() {
    const drawer = this.drawer.nativeElement;
    const botonchatbot = this.botonchatbot.nativeElement;
    if (this.isOpen && this.isMiddle) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 3}px)`;
      this.isMiddle = false;
      this.isOpen = true;
      this.position = 1;
      botonchatbot.style.display = 'none';
    } else if (this.isOpen && !this.isMiddle) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
      this.position = 3;
      botonchatbot.style.display = 'flex';
    } else if (!this.isOpen) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
      this.position = 2;
      botonchatbot.style.display = 'flex';
    }
  }

  //PRODUCTO SELECCIONADO
  getProducto(idProd: string) {
    this.seleccionado = true;
    this.toggleDrawer2(1);
    this.productosService.getProductoId(idProd).subscribe((result) => {
      this.productoSelect = result.productos;
      //console.log(this.productoSelect.nombre);
      this.getDetalle(idProd);
      if (this.productoSelect && this.productoSelect.grasas) {
        // Move actualizarGraficoPie() to a callback
        setTimeout(() => {
          this.actualizarGraficoPie();
        }, 100); // Adjust timeout as needed
      }
    });
  }

  getDetalle(idProd: string) {
    const productoEncontrado = this.listaCompra.find(
      (item) => item.idProd === Number(idProd)
    );
    if (productoEncontrado) {
      this.productoSelect!.cantidad = productoEncontrado.cantidad;
      this.productoSelect!.idLista = productoEncontrado.id;
      this.productoSelect!.enListaCompra = true;
      this.productoSelect!.comprado = productoEncontrado.comprado;
      //console.log('Valores asignados:', this.productoSelect);
    } else {
      console.log('Producto no encontrado en listaCompra');
    }
  }

  actualizarGraficoPie () {
    var valoresNutricionales = document.getElementById('valores-nutricionales');
    if(valoresNutricionales)
    var myChart = echarts.getInstanceByDom(valoresNutricionales);
    
    // Forzar la destrucción del gráfico existente si hay uno
    if (myChart) {
        myChart.dispose();
    }

    // Inicializar el nuevo gráfico
    myChart = echarts.init(valoresNutricionales);

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#BC4749', '#F2E8CF', '#A7C957', '#6A994E', '#386641'],
        series: [
            {
                name: 'Nutrientes',
                type: 'pie',
                radius: ['40%', '80%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: this.productoSelect!.grasas, name: 'Grasas'},
                    {value: this.productoSelect!.hidratos_carbono, name: 'Hidratos de carbono'},
                    {value: this.productoSelect!.fibra, name: 'Fibra'},
                    {value: this.productoSelect!.proteina, name: 'Proteina'},
                    {value: this.productoSelect!.sal, name: 'Sal'}
                ]
            }
        ]
    };

    myChart.setOption(option);
}


  colorStock(disponibilidad: number): any {
    if ((disponibilidad = 0)) {
      this.dispo = 'Agotado';
      return { color: 'red' };
    } else {
      this.dispo = 'Disponible';
      return { color: 'green' };
    }
  }

  EliminarProductoSelect() {
    this.productoSelect = null;
    this.seleccionado = false;
    this.toggleDrawer2(3);
  }

  //FUNCIONES BUSCADOR
  productos: Producto[] = [];

  buscadosP: Producto[] = [];

  //listaCompra: ListaCompra [] = [];

  valueBusquedaInput = '';

  private idUsu: string = '';

  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();
    this.fechasDefecto();
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

  cantidadProducto: number = 1;

  incrementar(productoDetalle: any) {
    productoDetalle.cantidad++;
    this.actualizarCantidad(
      productoDetalle.id,
      productoDetalle.cantidad,
      productoDetalle.idLista,
      productoDetalle.comprado
    );
    this.getListaCompraUsu();
    let tipo = 'anadido';
    let fecha = new Date();
    let tiempo = 0;
    this.estadistica(productoDetalle.id, tipo, fecha, tiempo);
  }

  //Estadisticas
  estadistica(id: any, tipo: any, fecha: any, tiempo: any) {
    const post: Stats = {
      nombre: tipo,
      idProd: id,
      fecha: fecha,
      id_usuario: this.idUsu,
      tiempo_uso: tiempo,
    };
    this.estadisticasService.postContador(post);
  }

  decrementar(productoDetalle: any) {
    if (productoDetalle.cantidad > 1) {
      productoDetalle.cantidad--;
      this.actualizarCantidad(
        productoDetalle.id,
        productoDetalle.cantidad,
        productoDetalle.idLista,
        productoDetalle.comprado
      );
    } else if (productoDetalle.cantidad <= 1) {
      this.eliminar(productoDetalle);
    } else {
      productoDetalle.cantidad--;
      this.actualizarCantidad(
        productoDetalle.id,
        productoDetalle.cantidad,
        productoDetalle.idLista,
        productoDetalle.comprado
      );
      let tipo = 'eliminado';
      let fecha = new Date();
      let tiempo = 0;
      this.estadistica(productoDetalle.id, tipo, fecha, tiempo);
    }
  }

  async eliminar(producto: any) {
    producto.enListaCompra = false;
    await this.borrarProd(producto.idLista);
    this.getListaCompraUsu();

    //ESTADISTICAS
    let tipo = 'eliminado';
    let fecha = new Date();
    let tiempo = 0;
    this.estadistica(producto.id, tipo, fecha, tiempo);
    this.motorServicio.getMotor().eliminarPin(producto.id);
  }

  async anadirProducto(producto: any) {
    this.nuevoPin = [];
    const productoEnLista = this.listaCompra.find(item => item.idProd === producto.id);
    if (productoEnLista) {
      console.log('El producto ya está en la lista de la compra.');
      return; // No hace falta añadir el producto nuevamente
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: producto.id,
      fecha: fechaActual,
      cantidad: 1,
      comprado: false,
    };
    this.productosService.postListaCompra(body).subscribe(async (result) => {
          this.getListaCompraUsu();
      let tipo = 'anadido';
      let fecha = new Date();
      let tiempo = 0;
      this.estadistica(producto.id, tipo, fecha, tiempo);
      try{
        await this.getListaCompraUsu();
        this.nuevoPin.push({id: producto.id, estado: false});
        await this.motorServicio.getMotor().crearPines(this.nuevoPin, 0)
        this.refrescarDrawer();
        this.EliminarProductoSelect();
        this.borrarBusqueda();

      } catch (error) {
        console.error('Error al recargar el modelo:', error);
      }
    });    
    //this.Recarguita();
    
  }


  getBusquedaProducto(event: any) {
    const query = (event || '').toLowerCase();
    this.mostrarBusqueda = true;

    this.productosService.getBusquedaProducto(query).subscribe((res) => {
      this.productos = res.productos;

      this.compararListaBusqueda();
    });
  }

  mostrarBusqueda: boolean = false;
  borrarBusqueda(){
    this.mostrarBusqueda = false;
  }
  async getListaCompraUsu() {
    const result = await this.productosService.getListaCompra(this.idUsu).toPromise();
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) => ({
          idProd: item.idProd,
          cantidad: item.cantidad,
          id: item.id,
          comprado: item.comprado,
          fecha: item.fecha
        }));
        // Contador de productos en la lista de compra
        this.totalProductos = this.listaCompra.length;

        // Contador de productos marcados como comprados
        this.totalComprados = this.listaCompra.reduce((total, item) => {
          return total + (item.comprado ? 1 : 0);
        }, 0);

        let a = document.getElementById('contador-p');
        if (a)
          a.innerHTML =
        '<p>' + this.totalComprados + '/' + this.totalProductos + '<i style="margin-left: 10px; font-size: 16px;" class="fa-solid fa-cart-shopping"></i></p>';
      }
  }

  compararListaBusqueda() {
    this.listaCompra.forEach((productoCompra) => {
      const productoEncontrado = this.productos.find(
        (producto) => productoCompra.idProd === parseInt(producto.id)
      );
      if (productoEncontrado) {
        productoEncontrado.enListaCompra = true;
        productoEncontrado.cantidad = productoCompra.cantidad;
        productoEncontrado.idLista = productoCompra.id;
        productoEncontrado.comprado = productoCompra.comprado;
        //console.log(`Producto con id ${productoEncontrado.id} está en la lista y su cantidad es ${productoEncontrado.cantidad}`);
      } else {
        // console.log(`No se encontró el producto con idProd ${productoCompra.idProd} en la lista de productos`);
      }
    });
  }

  async borrarProd(idLista: string) {
    await this.productosService.deleteListaCompra(idLista).toPromise();
    this.EliminarProductoSelect();
    await this.getListaCompraUsu();
  }

  actualizarCantidad(
    idProd: string,
    nuevaCantidad: number,
    idLista: string,
    comprado: boolean
  ) {
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: idProd,
      fecha: fechaActual,
      cantidad: nuevaCantidad,
      comprado: comprado,
    };

    this.productosService.putListaCompra(idLista, body).subscribe(
      (res) => {
        this.RecargarValoresLista();
        this.getListaCompraUsu(); // Llamar a getListaCompraUsu() después de la actualización
      },
      (error) => {
        console.error('Error en la solicitud PUT:', error);
      }
    );
  }

  sendRotacion(event: any) {
    this.rotacionService.setRotacion(event.target.value);
  }

  //MARCAR COMO COMPRADO
  marcarComprado(producto: any) {
    producto.comprado = true;
    this.actualizarCantidad(
      producto.id,
      producto.cantidad,
      producto.idLista,
      producto.comprado
    );
    let tipo = "comprado";
    let fecha = new Date()
    let tiempo = 0;
    this.estadistica(producto.id, tipo, fecha, tiempo );
    this.motorServicio.getMotor().marcarComoComprado(producto.id);
  }

  eliminarComprado(producto: any) {
    producto.comprado = false;
    this.motorServicio.getMotor().marcarComoComprado(producto.id, false);
    this.actualizarCantidad(
      producto.id,
      producto.cantidad,
      producto.idLista,
      producto.comprado
    );
  }

  RecargarValoresLista() {
    let a = document.getElementById('contador-p');
    if (a)
      a.innerHTML =
    '<p>' + this.totalComprados + '/' + this.totalProductos + '<i style="margin-left: 10px; font-size: 16px;" class="fa-solid fa-cart-shopping"></i></p>';
  }

  //CHATBOT
  abrirChatbot() {
    const chatbot = this.chatbot.nativeElement;
    chatbot.style.display = 'block';
    setTimeout(() => {
      chatbot.style.opacity = '1';
      chatbot.style.transform = 'translateY(25px)';
    }, 50);
  }

  cerrarChatbot() {
    const chatbot = this.chatbot.nativeElement;
    chatbot.style.opacity = '0';
    chatbot.style.transform = 'translateY(700px)';
    setTimeout(() => {
      chatbot.style.display = 'none';
    }, 500);
  }

  //Lista
  abrirLista() {
    const lista = this.lista.nativeElement;
    lista.style.display = 'block';
    setTimeout(() => {
      lista.style.opacity = '1';
      lista.style.transform = 'translateY(25px)';
    }, 50);
  }

  cerrarLista() {
    const lista = this.lista.nativeElement;
    lista.style.opacity = '0';
    lista.style.transform = 'translateY(700px)';
    setTimeout(() => {
      lista.style.display = 'none';
    }, 500);
  }

  //PROFILE

  abrirPerfil() {}

  logoutAndRedirectToLogin(): void {
    this.homeService.stopTimer().then(() => {
        setTimeout(() => {
            sessionStorage.removeItem('tokenUsuario');
            sessionStorage.removeItem('idUsuario');
            localStorage.removeItem('tokenUsuario');
            localStorage.removeItem('idUsuario');
            window.location.href = '/login';
        }, 100);
    });
}
  //CHATBOT
  //!Chatbot!!!
  loadChatbotScript() {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.onload = () => {
    };
    document.body.appendChild(script);
  }

  buscado(producto: any){
    let tipo = 'buscado';
    let fecha = new Date();
    let tiempo = 0;
    this.estadistica(producto.id, tipo, fecha, tiempo);
  }

  refrescarDrawer() {
    this.favoritos = []; // Limpiar la lista actual de favoritos
    this.getContadoresMasBuscados(); // Por ejemplo, recargar la lista de favoritos
  }
}


