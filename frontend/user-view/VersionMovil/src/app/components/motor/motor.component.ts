import { AfterViewInit, Component, OnInit, Input, Output} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from '../drawer/drawer.component';
import { RouterLinkDelegate } from '@ionic/angular';
export let motor: TMotorTAG;//Injectable
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})

export class MotorComponent implements AfterViewInit{
  private productos!: Producto[];
  private suelo!: TNodo;
  private ubicaciones: TNodo[] = [];
  private pins: TNodo[] = [];
  constructor(private productosService: ProductosService) { }

  ngAfterViewInit(): void {
    
  }

  async crearEscena(){
    motor = new TMotorTAG();
 
    //Creamos nodo padre
    const mercado: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));

    //asignar camara
    const camara: TNodo = await motor.crearCamara(mercado, glMatrix.vec3.fromValues(-4.5,15,-55), glMatrix.vec3.fromValues(15*(Math.PI / 180),0,0), glMatrix.vec3.fromValues(1,1,1), true, false, 0.1, 100);
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);
 
    //asignar luces
    const luzTop: TNodo = await motor.crearLuz(null, glMatrix.vec3.fromValues(200, 200, 200), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(0, 0, 0), 1.5, "Direccional");
    await motor.registrarLuz(luzTop);
    await motor.setLuz(luzTop);
  
    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    this.suelo = await motor.crearModelo( mercado, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,215*(Math.PI / 180),0), glMatrix.vec3.fromValues(0.425,0.425,0.425), 'suelo.obj', 'malla', 'gris.jpg', true);

    const puerta: TNodo = await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,43), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'puerta.obj', 'malla', 'grisclaro.jpeg', true);

    //Fruta
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-1,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(6,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(13,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(20,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    
    //Estanterias pasillo 1
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    
    //Estanterias pasillo 2
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Estanterias pasillo 3
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg',true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Estanterias fondo
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,10), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,13), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,10), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,13), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,18), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,21), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,18), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,21), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Armarios
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(7,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(14,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(21,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));

    //Frigos
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,12), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg',true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,15), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,21), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));

    //Mueble dobles
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-1,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-15,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));

    //Cajas registradoras
    const caja1: TNodo = await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,6), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja2: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,12), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja3: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja4: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,24), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);

    await this.cargarNodosPines();
    
    mercado.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }

  async cargarNodosPines() {
    try {
      const res: any = await this.productosService.getAllProdSinPag().toPromise();
      for (let index = 0; index < res.productos.length; index++) {
        let pin!: TNodo;
        this.pins.push(pin);
      }
      
      for (let index = 0; index < res.productos.length; index++) {
        const producto: Producto = res.productos[index];
        if(index <= 5){  
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 0, 0),
            glMatrix.vec3.fromValues(0, -90*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(1, 1, 1),
            'pin.obj',
            'malla',
            producto.foto, 
            false
          );
        }
        else if(index > 5){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 0, 0),
            glMatrix.vec3.fromValues(0, 0, 0),
            glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
            'pin.obj',
            'malla',
            producto.foto,
            true
          );
        }
      }
    } catch (error) {
      console.error('Error al cargar los nodos de pines:', error);
    }
  }
}
