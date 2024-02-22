import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { GestureController, Platform } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from "../../environments/environment";

export interface Producto{
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
  enListaCompra: boolean,
  idLista: string,
  //Ubicacions: Ubicaciones[]
 //Promocions: Promociones[]

 cantidad: number,
}


export interface ListaCompra{
  id: string,
  idUsu: string,
  idProd: number,
  fecha: string | null,
  cantidad: number,
}

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DrawerComponent  implements AfterViewInit {
  @ViewChild('drawer', { read: ElementRef}) drawer!: ElementRef;
 // @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('botonchatbot', {read: ElementRef}) botonchatbot!: ElementRef;
  @ViewChild('chatbot', {read: ElementRef}) chatbot!: ElementRef;
  @ViewChild('profile', {read: ElementRef}) profile!: ElementRef;

  isOpen = true;
  openHeight = 0;
  isMiddle = true;

  //PRODUCTO SELECCIONADO
  productoSelect: any;
  dispo: string = '';
  seleccionado: boolean = false;


  //VARIABLES FOTO
  tokenUsuario = sessionStorage.getItem('tokenUsuario') || localStorage.getItem('tokenUsuario');
  urlFotoProducto = environment.base_url + '/uploads/fotoproducto/';

  constructor(private plt: Platform, private gestureCtrl: GestureController,
    private productosService: ProductosService ) { }

  async ngAfterViewInit() {
  const drawer = this.drawer.nativeElement;
  this.openHeight = (this.plt.height() / 100);
  const botonchatbot = this.botonchatbot.nativeElement;
  //const chatbot = this.chatbot.nativeElement;
  const profile = this.profile.nativeElement;
  

  drawer.style.transform = `translateY(500px)`;
  
  const gesture = await this.gestureCtrl.create({
    el: drawer,
    gestureName: 'swipe',
    direction: 'y',
    onMove: ev => {
      //console.log(ev);
      if (ev.deltaY < -this.openHeight || ev.deltaY > this.openHeight) return;
      drawer.style.transform = `translateY(${ev.deltaY}px)`;
    },
    onEnd: ev => {
      if (this.isMiddle) {
        if (ev.deltaY < -50) { 
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${this.openHeight * 3}px)`; // Ir a la posición superior
          this.isMiddle = false;
          this.isOpen = true;
          botonchatbot.style.display = 'none';
          profile.style.display = 'none';
          console.log('Vamos arriba');
        } else if (ev.deltaY > 50) { 
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${this.openHeight * 84}px)`; // Ir a la posición inferior
          this.isMiddle = false;
          this.isOpen = false;
          botonchatbot.style.display = 'flex';
          console.log('Vamos abajo');
        } else { 
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
          botonchatbot.style.display = 'flex';
          console.log('Vamos medio');
        }
      } else if (this.isOpen) { 
        if (ev.deltaY > 50) { 
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
          this.isOpen = false;
          this.isMiddle = true;
          botonchatbot.style.display = 'flex';
          console.log('Vamos medio');
        }
      } else { 
        if (ev.deltaY < -50) { 
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${this.openHeight * 60}px)`; // Ir a la posición media
          this.isOpen = true;
          this.isMiddle = true;
          botonchatbot.style.display = 'flex';
          console.log('Vamos medio');
        }
      }
        
      

    }
  });
  gesture.enable(true);
}

  toggleDrawer2(position: number){
    const drawer = this.drawer.nativeElement;
    const botonchatbot = this.botonchatbot.nativeElement;
    // 1 -> Arriba
    // 2 -> Medio
    // 3 -> Abajo
    if (position == 1){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 3}px)`;
      this.isMiddle = false;
      this.isOpen = true;
      botonchatbot.style.display = 'none';
    } 
    if (position == 2){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
      botonchatbot.style.display = 'flex';
    } 
     if (position == 3){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
      botonchatbot.style.display = 'flex';
    }
  }

  toggleDrawer(){
    const drawer = this.drawer.nativeElement;
    const botonchatbot = this.botonchatbot.nativeElement;
    if(this.isOpen && this.isMiddle){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 3}px)`;
      this.isMiddle = false;
      this.isOpen = true;
      botonchatbot.style.display = 'none';
      console.log('Vamos arriba');
      
    } else if (this.isOpen && !this.isMiddle){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 84}px)`;
      this.isMiddle = false;
      this.isOpen = false;
      botonchatbot.style.display = 'flex';
      console.log('Vamos abajo');
    } else if(!this.isOpen){
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${this.openHeight * 60}px)`;
      this.isMiddle = true;
      this.isOpen = true;
      botonchatbot.style.display = 'flex';
      console.log('Vamos medio');
    }
  }


  //PRODUCTO SELECCIONADO
getProducto(idProd: string){
  this.seleccionado = true;
  this.toggleDrawer2(2);
  this.productosService.getProductoId(idProd).subscribe( result => {
    this.productoSelect = result.productos;
    console.log(this.productoSelect.nombre);
  });
}

colorStock(disponibilidad: number): any{
  if (disponibilidad = 0) {
    this.dispo = 'Agotado';
    return { 'color': 'red' };
    
  } else {
    this.dispo = 'Disponible'
    return { 'color': 'green'  };
  }
}

EliminarProductoSelect(){
  this.productoSelect = null;
  this.seleccionado = false;
  this.toggleDrawer2(2);
}

//FUNCIONES CONTROL CSS




//FUNCIONES BUSCADOR
  productos: Producto [] = [];
  
  listaCompra: ListaCompra [] = [];

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
      console.log('El usuario logueado es: '+ this.idUsu);
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
  }

  cantidadProducto: number = 1;


  incrementar(producto: any){
    producto.cantidad++;
      console.log('Nueva cantidad = ' +  producto.cantidad)
      this.actualizarCantidad(producto.id, producto.cantidad, producto.idLista) 
  }

  decrementar(producto: any){
    if (producto.cantidad > 1){
      producto.cantidad--;
    console.log('Nueva cantidad = ' +  producto.cantidad)
    this.actualizarCantidad(producto.id, producto.cantidad, producto.idLista) 
    }else{
      console.log('Solo queda una');
    }
  }

  eliminar(producto: any){
    producto.enListaCompra = false;
    this.borrarProd(producto.idLista);
  }

  anadirProducto(producto: any){
    const fechaActual = new Date().toISOString().split('T')[0];
    const body = {
      idUsu: this.idUsu,
      idProd: producto.id,
      fecha: fechaActual, 
      cantidad: 1
    };
    this.productosService.postListaCompra(body )
    .subscribe((result) => {
      console.log(result);
    })
    this.compararListaBusqueda();
    producto.enListaCompra = true;
    
  }


  getBusquedaProducto(event: any) {
    const query = event.toLowerCase();
    this.productosService.getBusquedaProducto(query)
      .subscribe(res => {
        this.productos = res.productos;
        console.log(this.productos);

        this.compararListaBusqueda();
      });    
  }
  getListaCompraUsu() {
    this.productosService.getListaCompra(this.idUsu).subscribe((result) => {
      if (result.listacompra) {
        this.listaCompra = result.listacompra.map((item: ListaCompra) => 
        ({ idProd: item.idProd, 
          cantidad: item.cantidad, 
          id: item.id
        }));
  
        console.log(this.listaCompra);
      } 
    });
  }

  compararListaBusqueda(){
    this.listaCompra.forEach((productoCompra) => {
      const productoEncontrado = this.productos.find((producto) => productoCompra.idProd === parseInt(producto.id));
      if (productoEncontrado) {
        productoEncontrado.enListaCompra = true;
        productoEncontrado.cantidad = productoCompra.cantidad;
        productoEncontrado.idLista = productoCompra.id;
        //console.log(`Producto con id ${productoEncontrado.id} está en la lista y su cantidad es ${productoEncontrado.cantidad}`);
      } else {
       // console.log(`No se encontró el producto con idProd ${productoCompra.idProd} en la lista de productos`);
      }
    });
  }

  borrarProd(idLista: string){
    this.productosService.deleteListaCompra(idLista).subscribe((result) =>{
      //this.getProductos(); //Recarga la lista de producto
    });
  }


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

//CHATBOT
abrirChatbot() {
  const chatbot = this.chatbot.nativeElement;
  chatbot.style.display = 'block';
  setTimeout(() => {
    chatbot.style.opacity = '1';
    chatbot.style.transform = 'translateY(25px)';
  }, 50); // Agregar un pequeño retraso para asegurar que la transición se aplique correctamente
}

cerrarChatbot() {
  const chatbot = this.chatbot.nativeElement;
  chatbot.style.opacity = '0';
  chatbot.style.transform = 'translateY(700px)';
  setTimeout(() => {
    chatbot.style.display = 'none';
  }, 500); // Asegurarse de ocultar el chatbot después de la transición completa
}


//PROFILE

abrirPerfil(){
  
}



}
