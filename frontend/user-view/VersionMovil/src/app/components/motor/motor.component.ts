import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto, ListaCompra } from '../drawer/drawer.component';
import { MotorService } from '../../services/motor.service';
import { Ubicacion } from 'src/app/home/home.page';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { TRecursoTextura } from './clases/TRecursoTextura';
import { mat4 } from 'gl-matrix';

export let motor: TMotorTAG;

interface pin{
  idProd: number,
  nodo: TNodo,
  padre: TNodo,
  recText: TRecursoTextura,
  estado: boolean
}

interface lista {
  id: string;
  estado: boolean;
}
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})
export class MotorComponent implements AfterViewInit {
  private suelo!: TNodo;
  private mercado!: TNodo;
  private ubicaciones: TNodo[] = [];
  private listaCompra: lista[] = [];
  private pines: pin[] = [];

  //Eventos
  private rotation: any = 0;
  private lastTouchX: number = 0;
  private lastTouchY: number = 0;
  private isRightTouchDown: boolean = false;

  private translationX: number = 0;
  private translationY: number = 0;
  private translationSpeed: number = 0.1;

  private zoomFactor: number = 1;
  private zoomSpeed: number = 0.05;
  private distancia: number = 0;
  private lastPinchDistance: number = 0;
  private isPinching: boolean = false;

  
  private touchStartTime!: number;
  private touchEndTime!: number;
  private touchMoved: boolean = false;

  constructor(
    private productosService: ProductosService,
    private ubicacionService: UbicacionesService,
    @Inject(MotorService) private motorServicio: MotorService
  ) {}

  ngAfterViewInit(): void {
  }

  getMercado(){
    return this.mercado;
  }

  async crearEscena() {
    motor = new TMotorTAG();

    //Creamos nodo padre
    this.mercado = await motor.crearNodo(
      null,
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1)
    );
    //asignar camara
    const camara: TNodo = await motor.crearCamara(
      this.mercado,
      glMatrix.vec3.fromValues(-4.5, 12, -40),
      glMatrix.vec3.fromValues(15 * (Math.PI / 180), 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1),
      true,
      false,
      0.1,
      100
    );
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);

    //asignar luces
    const luzTop: TNodo = await motor.crearLuz(
      null,
      glMatrix.vec3.fromValues(200, 200, 200),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
      'Direccional',
      glMatrix.vec4.fromValues(20, 20, 20, 1)
    );
    await motor.registrarLuz(luzTop);
    await motor.setLuz(luzTop);

    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma("vertexShader.glsl", "fragmentShader.glsl");
    await motor.iniciarPrograma("vertexColorPicking.glsl", "fragmentColorPicking.glsl");

    this.suelo = await motor.crearModelo(
      this.mercado,
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 215 * (Math.PI / 180), 0),
      glMatrix.vec3.fromValues(0.425, 0.425, 0.425),
      'suelo.obj',
      'malla',
      'gris.jpg',
      -1,
    );

    const puerta: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 43),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1),
      'puerta.obj',
      'malla',
      'grisclaro.jpeg',
      -1
    );

    //Fruta
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-1, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(6, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(13, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(20, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Estanterias pasillo 1
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Estanterias pasillo 2
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Estanterias pasillo 3
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Estanterias fondo
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 10),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 13),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 10),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 13),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 18),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 21),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 18),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 21),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Armarios
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(7, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(14, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(21, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Frigos
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 12),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 15),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 18),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 21),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Mueble dobles
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-1, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-15, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg',
        -1
      )
    );

    //Cajas registradoras
    const caja1: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 6),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const caja2: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 12),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const caja3: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 18),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const caja4: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 24),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const pantalla1: TNodo = await motor.crearModelo(
      caja1,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const pantalla2: TNodo = await motor.crearModelo(
      caja2,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const pantalla3: TNodo = await motor.crearModelo(
      caja3,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg',
      -1
    );
    const pantalla4: TNodo = await motor.crearModelo(
      caja4,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg',
      -1
    );

    const idUsu: string = await this.getUsuarioLog();
    //Para cada producto en lista compra
    const res: any = await this.productosService
      .getListaCompra(idUsu)
      .toPromise();
    for (let j = 0; j < res.listacompra.length; j++) {
      this.listaCompra.push({
        id: res.listacompra[j].idProd,
        estado: res.listacompra[j].comprado,
      });
    }

    await this.crearPines(this.listaCompra, 1);
    await this.mercado.recorrer(mat4.create());

    //EVENTOS
    let pinchTimeout: any;
    let touchMoveTimeout: any;
    let isWaitingForSingleTouch = false;

    const handleRightDragMobile = (event: TouchEvent) => {
      event.preventDefault();
    
      const touch = event.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
    
      if(this.isRightTouchDown){
        this.translationX += (this.lastTouchX - touchX) * this.translationSpeed;
        this.translationY += (this.lastTouchY - touchY) * this.translationSpeed;
        motor.setTraslacion(this.translationX, this.translationY);
      }
      this.lastTouchX = touchX;
      this.lastTouchY = touchY;
    };
    
    const handlePinch = (event: TouchEvent) => {
        event.preventDefault();
    
        let oldFactor = this.zoomFactor;
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
    
        // Calcula la distancia entre los dos puntos de contacto
        const deltaX = touch1.clientX - touch2.clientX;
        const deltaY = touch1.clientY - touch2.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
        // Calcula la diferencia de distancia desde el último pellizco
        const deltaDistance = this.lastPinchDistance - distance;
    
        // Ajusta el factor de zoom en función de la diferencia de distancia
        this.zoomSpeed = 0.05; // Velocidad de zoom
        this.zoomFactor *= 1 + deltaDistance * this.zoomSpeed;
    
        // Actualiza la última distancia de pellizco
        this.lastPinchDistance = distance;
        if(this.zoomFactor < 0.2){
          this.zoomFactor = oldFactor;
        }
        else if (this.zoomFactor > 1.5){
          this.zoomFactor = oldFactor;
        }
        motor.setZoom(this.zoomFactor);
    };
    
    // Método para manejar el evento de final de pellizco (pinch)
    const handlePinchEnd = (event: TouchEvent) => {
        event.preventDefault();
    
        this.isPinching = false;
    };

    const handleMouseWheel = (event: WheelEvent) => {
      const delta = event.deltaY;
      let oldFactor = this.zoomFactor;

      if(delta > 0){
          this.zoomFactor += 0.01;
      }
      else if (delta < 0){
          this.zoomFactor += -0.01;
      }
      if(this.zoomFactor < 0.2){
        this.zoomFactor = oldFactor;
      }
      else if (this.zoomFactor > 1.5){
        this.zoomFactor = oldFactor;
      }
      motor.setZoom(this.zoomFactor);
  };
    
    // Manejar el evento de clic/touch
    const handleClick = (event: TouchEvent) => {
      motor.gl.clear(motor.gl.COLOR_BUFFER_BIT | motor.gl.DEPTH_BUFFER_BIT);
      motor.useProgramColor(motor.gl);
      // Obtener la primera posición de contacto
      const canvas = document.querySelector("#mercado") as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      let touch = event.touches[0];
      // Obtener coordenadas X e Y 
      let x = touch.clientX - rect.left;;
      let y = touch.clientY - rect.top;;
      let ejeY = canvas.clientHeight - y;
      let ejeX = x;
      requestAnimationFrame(() => {
        const pixel = new Uint8Array(4);
        motor.gl.readPixels(ejeX, ejeY, 1, 1, motor.gl.RGBA, motor.gl.UNSIGNED_BYTE, pixel);
        // Convertir los valores de 0-255 a 0-1
        const color = new Float32Array([
            pixel[0] / 255,
            pixel[1] / 255,
            pixel[2] / 255,
            pixel[3] / 255
        ]);
        var id = this.colorToID(color);
        var idString = id.toString();
        this.motorServicio.getDrawer().getProducto(idString);
        motor.useProgramMain(motor.gl);
      });
    };
  
    // Agregar el evento de clic derecho al canvas
    // Agrega un evento touchstart para detectar cuando se toca la pantalla
    motor.gl.canvas.addEventListener('wheel', (event: any) => {
        // Verificar si el evento es una rueda del ratón y no un toque
        if (event.type === 'wheel') {
            handleMouseWheel(event as WheelEvent);
        }
    });
    
    // Agregar listeners de eventos táctiles al canvas
    motor.gl.canvas.addEventListener('touchstart', (event: any) => {
      this.touchStartTime = new Date().getTime();
    
      if (event.touches.length === 2) {
        this.isPinching = true;
        this.lastPinchDistance = Math.sqrt(
          Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) +
          Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2)
        );
      } else {
        this.isRightTouchDown = true;
        const touch = event.touches[0];
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
      }
    
      // Manejar el clic/touch dentro del evento 'touchstart'
      handleClick(event);
    });
    
    motor.gl.canvas.addEventListener('touchmove', (event: any) => {
      if (event.touches.length === 2) {
        handlePinch(event);
      } else {
        handleRightDragMobile(event);
      }
    });
    
    motor.gl.canvas.addEventListener('touchend', (event: any) => {
      this.touchEndTime = new Date().getTime();
    
      if (event.touches.length === 0) {
        this.isRightTouchDown = false;
        handlePinchEnd(event);
    
        // Esperar un corto tiempo antes de manejar posibles eventos de arrastre
        pinchTimeout = setTimeout(() => {
          this.isRightTouchDown = false;
          isWaitingForSingleTouch = false;
        }, 200); // 200 ms es un ejemplo de tiempo de espera
      } else if (event.touches.length === 1 && this.isPinching) {
        // Set a flag and timeout to wait for potential single touch event
        isWaitingForSingleTouch = true;
        touchMoveTimeout = setTimeout(() => {
          if (isWaitingForSingleTouch) {
            this.isRightTouchDown = true;
            isWaitingForSingleTouch = false;
          }
        }, 200); // Ajusta el tiempo según sea necesario
      }
    });  
  }

  async getUsuarioLog() {
    const idUsuario = localStorage.getItem('idUsuario');
    let idUsu = '';
    if (idUsuario !== null) {
      idUsu = idUsuario;
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
    return idUsu;
  }

  async marcarComprado(idProd: number){
    const pinCambiar = this.pines.find(pin => pin.idProd === idProd);
    pinCambiar!.estado = true;
  }

  async eliminarComprados(){
    let borrar = [];

    for(let i = 0; i < this.pines.length; i++){
      if(this.pines[i].estado == true){
        borrar.push(this.pines[i]);
        const entidad = this.pines[i].nodo.getEntidad();
        const malla = entidad.recursoMalla;
        await malla.mallas.forEach((malla: any) => {
          let vertexBuffer = malla.vertexBuffer;
          motor.gl.deleteBuffer(vertexBuffer);

          let normalBuffer = malla.normalBuffer;
          motor.gl.deleteBuffer(normalBuffer);

          let indexBuffer = malla.indexBuffer;
          motor.gl.deleteBuffer(indexBuffer);

          let textureBuffer = malla.tetxureBuffer;
          motor.gl.deleteBuffer(textureBuffer);
        });
        await this.pines[i].nodo.setEntidad(null);
      }
    }
    
    for(let i = 0; i < this.pines.length; i++){
      if(borrar[i] == this.pines[i]){
        this.pines.splice(i, 1);
      }
    }
  }

  async eliminarTodosPines(){
    for(let i = 0; i < this.pines.length; i++){
      const entidad = this.pines[i].nodo.getEntidad();
      const malla = entidad.recursoMalla;
      await malla.mallas.forEach((malla: any) => {
        let vertexBuffer = malla.vertexBuffer;
        motor.gl.deleteBuffer(vertexBuffer);

        let normalBuffer = malla.normalBuffer;
        motor.gl.deleteBuffer(normalBuffer);

        let indexBuffer = malla.indexBuffer;
        motor.gl.deleteBuffer(indexBuffer);

        let textureBuffer = malla.tetxureBuffer;
        motor.gl.deleteBuffer(textureBuffer);
      });
      await this.pines[i].nodo.setEntidad(null);
    }
    this.pines = [];
  }

  async eliminarPines(idProd: number){
    let pinBorrar = this.pines.find(pin => pin.idProd === idProd);
    const entidad = pinBorrar!.nodo.getEntidad();
    pinBorrar!.nodo.setEntidad(null)
    const malla = entidad.recursoMalla;

    await malla.mallas.forEach((malla: any) => {
      var buffers = malla.getBuffers();
      var gl = malla.getGL();
      if(gl && buffers){
        console.log(gl.deleteBuffer(buffers.vertexBuffer));
        console.log(gl.deleteBuffer(buffers.normalBuffer));
        console.log(gl.deleteBuffer(buffers.textureBuffer));
        console.log(gl.deleteBuffer(buffers.indexBuffer));
      } else {
        console.log("WebGL context or buffers not available.");
      }
    });
    
    for(let i = 0; i < this.pines.length; i++){
      if(this.pines[i] == pinBorrar){
        this.pines.splice(i, 1);
      }
    }
    await this.mercado.recorrer(mat4.create());
  }

  async crearPines(lista: lista[], number: number) {
    const canvas = document.querySelector("#mercado") as HTMLCanvasElement;

    let valor!: number;
    for (let i = 0; i < lista.length; i++) {
        let nameMalla = 'pin.obj';

        const producto: any = await this.productosService.getProductoId(lista[i].id).toPromise();

        await producto.productos.Ubicacions.forEach((ubicacion: any) => {
            valor = this.letraANumero(ubicacion.referencia) + ubicacion.posicion;
        });

      let pin;
      if(valor <= 4){
        pin = await motor.crearModelo(
          this.ubicaciones[valor],
          glMatrix.vec3.fromValues(0, 0, 0),
          glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
          glMatrix.vec3.fromValues(1, 1, 1),
          nameMalla,
          'malla',
          producto.productos.foto,
          producto.productos.id
        );
      }
      else if(valor > 4 && valor <= 30){
        pin = await motor.crearModelo(
          this.ubicaciones[valor],
          glMatrix.vec3.fromValues(0, 0, 0),
          glMatrix.vec3.fromValues(0, -45*(Math.PI / 180), 0),
          glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
          nameMalla,
          'malla',
          producto.productos.foto,
          producto.productos.id
        );
      }
      else if(valor > 30 && valor <= 33){
        pin = await motor.crearModelo(
          this.ubicaciones[valor],
          glMatrix.vec3.fromValues(0, 2.5, 0),
          glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
          glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
          nameMalla,
          'malla',
          producto.productos.foto,
          producto.productos.id
        );
      }
      else if(valor > 33 && valor <= 37){
        pin = await motor.crearModelo(
          this.ubicaciones[valor],
          glMatrix.vec3.fromValues(0, 2.5, 0),
          glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
          glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
          nameMalla,
          'malla',
          producto.productos.foto,
          producto.productos.id
        );
      }
      else if(valor > 37 && valor <= 40){
        pin = await motor.crearModelo(
          this.ubicaciones[valor],
          glMatrix.vec3.fromValues(0, 1, 0),
          glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
          glMatrix.vec3.fromValues(1, 1, 1),
          nameMalla,
          'malla',
          producto.productos.foto,
          producto.productos.id
        );
      }
      this.pines.push({idProd: producto.productos.id, nodo: pin, padre: this.ubicaciones[valor], recText: producto.productos.foto, estado: false});
      //Para que solo recorra los nodos necesarios cuando se añade un producto SOLAMENTE
      if(number == 0){
        await this.ubicaciones[valor].recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
        break;
      }
    }
  }

  letraANumero(letra: string): number {
    let numero!: number;
    if(letra == 'A'){
      numero = 0;
    }
    else if(letra == 'B'){
      numero = 10;
    }
    else if(letra == 'C'){
      numero = 20;
    }
    else if(letra == 'D'){
      numero = 30;
    }
    else if(letra == 'E'){
      numero = 40;
    }

    return numero;
  }

  colorToID(color: Float32Array): number {
    // Obtener la cantidad de bits para cada componente del color
    const redBits = motor.gl.getParameter(motor.gl.RED_BITS);
    const greenBits = motor.gl.getParameter(motor.gl.GREEN_BITS);
    const blueBits = motor.gl.getParameter(motor.gl.BLUE_BITS);
    const alphaBits = motor.gl.getParameter(motor.gl.ALPHA_BITS);

    // Convertir los componentes del color de 0-1 a 0-255
    const r = Math.round(color[0] * ((1 << redBits) - 1));
    const g = Math.round(color[1] * ((1 << greenBits) - 1));
    const b = Math.round(color[2] * ((1 << blueBits) - 1));
    const a = Math.round(color[3] * ((1 << alphaBits) - 1));

    // Calcular los desplazamientos para combinar los componentes en un solo número
    const greenShift = blueBits + alphaBits;
    const redShift = greenShift + greenBits;
    
    // Combinar los componentes en un solo número
    const id = (r << redShift) | (g << greenShift) | (b << alphaBits) | a;

    return id;
  }

}


