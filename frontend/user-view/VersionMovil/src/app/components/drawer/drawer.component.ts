import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { MotorComponent } from '../motor/motor.component';

import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../environments/environment';
import * as echarts from 'echarts';
import { HomePage } from 'src/app/home/home.page';
import { Malla } from '../motor/clases/Malla';
import { RotacionService } from 'src/app/services/rotacion.service';

interface Stats {
  nombre: string;
  idProd: number;
  fecha: Date;
  idUsuario: string;
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
  ingerdientes: string;
  foto: string;
  precio: Float32Array;
  enListaCompra: boolean;
  idLista: string;
  cantidad: number;
  comprado: boolean;
  //Ubicacions: Ubicaciones[]
  //Promocions: Promociones[]
}

export interface ListaCompra {
  id: string;
  idUsu: string;
  idProd: number;
  fecha: string | null;
  cantidad: number;
  comprado: boolean;
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


  //PRODUCTO SELECCIONADO
  productoSelect: any;
  dispo: string = '';
  seleccionado: boolean = false;
  listaCompra: ListaCompra[] = [];

  totalProductos: number = 0;
  totalComprados: number = 0;
  //MODELO
  modeloService = new ModeloService();

  //VARIABLES FOTO
  tokenUsuario =
    sessionStorage.getItem('tokenUsuario') ||
    localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  @ViewChild(MotorComponent) motorComponent!: MotorComponent;
  @ViewChild(Malla) malla!: Malla;
  constructor(
    private plt: Platform,
    private gestureCtrl: GestureController,
    private productosService: ProductosService,
    private estadisticasService: EstadisticasService,
    private rotacionService: RotacionService
  ) {}

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
          } else if (ev.deltaY > 50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 84}px)`; // Ir a la posición inferior
            this.isMiddle = false;
            this.isOpen = false;
            botonchatbot.style.display = 'flex';
          } else {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
            botonchatbot.style.display = 'flex';
          }
        } else if (this.isOpen) {
          if (ev.deltaY > 50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
            this.isOpen = false;
            this.isMiddle = true;
            botonchatbot.style.display = 'flex';
          }
        } else {
          if (ev.deltaY < -50) {
            drawer.style.transition = '.4s ease-out';
            drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
            this.isOpen = true;
            this.isMiddle = true;
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
      botonchatbot.style.display = 'none';
    }
    if (position == 2) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
      botonchatbot.style.display = 'flex';
    }
    if (position == 3) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
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
      botonchatbot.style.display = 'none';
    } else if (this.isOpen && !this.isMiddle) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
      botonchatbot.style.display = 'flex';
    } else if (!this.isOpen) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
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
      this.productoSelect.cantidad = productoEncontrado.cantidad;
      this.productoSelect.idLista = productoEncontrado.id;
      this.productoSelect.enListaCompra = true;
      this.productoSelect.comprado = productoEncontrado.comprado;
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
                    {value: this.productoSelect.grasas, name: 'Grasas'},
                    {value: this.productoSelect.hidratos_carbono, name: 'Hidratos de carbono'},
                    {value: this.productoSelect.fibra, name: 'Fibra'},
                    {value: this.productoSelect.proteina, name: 'Proteina'},
                    {value: this.productoSelect.sal, name: 'Sal'}
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
    this.toggleDrawer2(2);
  }

  //FUNCIONES BUSCADOR
  productos: Producto[] = [];

  //listaCompra: ListaCompra [] = [];

  valueBusquedaInput = '';

  private idUsu: string = '';

  ngOnInit(): void {
    this.getUsuarioLog();
    this.getListaCompraUsu();
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
    this.estadistica(productoDetalle.id, tipo, fecha);
  }

  //Estadisticas
  estadistica(id: any, tipo: any, fecha: any) {
    const post: Stats = {
      nombre: tipo,
      idProd: id,
      fecha: fecha,
      idUsuario: this.idUsu,
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
      this.estadistica(productoDetalle.id, tipo, fecha);
    }
  }

  eliminar(producto: any) {
    producto.enListaCompra = false;
    this.borrarProd(producto.idLista);
    //this.EliminarProductoSelect();
    this.getProducto(producto.id);
    this.getListaCompraUsu();
    this.Recarguita();

    //ESTADISTICAS
    let tipo = 'eliminado';
    let fecha = new Date();
    this.estadistica(producto.id, tipo, fecha);
  }

  anadirProducto(producto: any) {
    //this.motorComponent.crearEscena();
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: producto.id,
      fecha: fechaActual,
      cantidad: 1,
      comprado: false,
    };
    this.productosService.postListaCompra(body).subscribe((result) => {
      producto.enListaCompra = true;
      producto.cantidad = 1;
      this.getListaCompraUsu();
      this.getProducto(producto.id);
    });
    this.compararListaBusqueda();
    producto.enListaCompra = true;
    let tipo = 'anadido';
    let fecha = new Date();
    this.estadistica(producto.id, tipo, fecha);
    this.Recarguita();
  }

  getBusquedaProducto(event: any) {
    const query = event.toLowerCase();
    this.productosService.getBusquedaProducto(query).subscribe((res) => {
      this.productos = res.productos;

      this.compararListaBusqueda();
    });
  }

  getListaCompraUsu() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) => ({
          idProd: item.idProd,
          cantidad: item.cantidad,
          id: item.id,
          comprado: item.comprado,
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
    });
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

  borrarProd(idLista: string) {
    this.productosService.deleteListaCompra(idLista).subscribe((result) => {
      //this.getProductos(); //Recarga la lista de producto
      this.EliminarProductoSelect();
      this.getListaCompraUsu();
    });
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
    this.estadistica(producto.id, tipo, fecha );
    //this.motorComponent.cargarNodosPines();
  }

  eliminarComprado(producto: any) {
    producto.comprado = false;
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
    localStorage.clear();
    window.location.href = '/login'; // Reemplaza '/login' con la URL real de tu página de inicio de sesión
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
    this.estadistica(producto.id, tipo, fecha);
  }
}


