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
      'gris.jpg'
    );

    const puerta: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 43),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1),
      'puerta.obj',
      'malla',
      'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
        'grisclaro.jpeg'
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
      'blanco.jpeg'
    );
    const caja2: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 12),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const caja3: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 18),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const caja4: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 24),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla1: TNodo = await motor.crearModelo(
      caja1,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla2: TNodo = await motor.crearModelo(
      caja2,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla3: TNodo = await motor.crearModelo(
      caja3,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla4: TNodo = await motor.crearModelo(
      caja4,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
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
    const canvas = motor.gl.canvas;
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
    }
  
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
        const deltaDistance = distance - this.lastPinchDistance;
  
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
    }
  
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
        
    // Agregar el evento de clic derecho al canvas
    // Agrega un evento touchstart para detectar cuando se toca la pantalla
    canvas.addEventListener('wheel', (event: any) => {
        // Verificar si el evento es una rueda del ratón y no un toque
        if (event.type === 'wheel') {
            handleMouseWheel(event as WheelEvent);
        }
    });

    canvas.addEventListener('touchstart', (event: any) => {
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
    });
  
    canvas.addEventListener('touchmove', (event: any) => {
      if (event.touches.length === 2) {
        handlePinch(event);
      } else {
        handleRightDragMobile(event);
      }
    });
  
    canvas.addEventListener('touchend', (event: any) => {
        if (event.touches.length === 0) {
            this.isRightTouchDown = false;
            handlePinchEnd(event);
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
      }
    }
    
    for(let i = 0; i < this.pines.length; i++){
      if(borrar[i] == this.pines[i]){
        this.pines.slice(i, 1);
      }
    }
  }

  async eliminarTodosPines(){
    for(let i = 0; i < this.pines.length; i++){
      console.log(this.pines[i]);
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
    }
    this.pines = [];
  }

  async eliminarPines(idProd: number){
    let pinBorrar = this.pines.find(pin => pin.idProd === idProd);
    const entidad = pinBorrar!.nodo.getEntidad();
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
          producto.productos.foto
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
          producto.productos.foto
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
          producto.productos.foto
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
          producto.productos.foto
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
          producto.productos.foto
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
}


