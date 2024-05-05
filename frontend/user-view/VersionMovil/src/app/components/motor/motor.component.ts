import { AfterViewInit, Component, OnInit, Input, Output} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
//import { MotorService } from 'src/app/services/motor.service';

export let motor: TMotorTAG;//Injectable
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})

export class MotorComponent implements OnInit{
  constructor(/*private motorService: MotorService*/) { }

  ngOnInit(): void {
      
  }

  async crearEscena(){
    motor = new TMotorTAG();
 
    //Creamos nodo padre
    const mercado: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));

    //asignar camara
    const camara: TNodo = await motor.crearCamara(mercado, glMatrix.vec3.fromValues(-4.5,15,-55), glMatrix.vec3.fromValues(15*(Math.PI / 180),0,0), glMatrix.vec3.fromValues(1,1,1), true, false, 1, 1000);
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);
 
    //asignar luces
  
    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    const suelo: TNodo = await motor.crearModelo( mercado, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,215*(Math.PI / 180),0), glMatrix.vec3.fromValues(0.425,0.425,0.425), 'suelo.obj', 'malla', 'gris.jpg');
    const puerta: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-25,0,43), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'puerta.obj', 'malla', 'grisclaro.jpeg');
    //Fruta
    const cajaFruta1: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblefruta.obj', 'malla', 'grisclaro.jpeg');
    const cajaFruta2: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-1,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblefruta.obj', 'malla', 'grisclaro.jpeg');
    const cajaFruta3: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(6,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblefruta.obj', 'malla', 'grisclaro.jpeg');
    const cajaFruta4: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(13,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblefruta.obj', 'malla', 'grisclaro.jpeg');
    const cajaFruta5: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(20,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblefruta.obj', 'malla', 'grisclaro.jpeg');
    
    //Estanterias pasillo 1
    const estanteria1: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,27), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria2: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,27), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria3: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,27), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria4: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,24), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria5: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,24), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria6: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,24), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    
    //Estanterias pasillo 2
    const estanteria7: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,17), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria8: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,17), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria9: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,17), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria10: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,14), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria11: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,14), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria12: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,14), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');

    //Estanterias pasillo 3
    const estanteria13: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,7), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria14: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,7), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria15: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,7), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria16: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-14,0,4), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria17: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-8,0,4), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria18: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(-2,0,4), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');

    //Estanterias fondo
    const estanteria19: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(12,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria20: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(12,0,13), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria21: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(18,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria22: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(18,0,13), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');

    const estanteria23: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(12,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria24: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(12,0,21), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria25: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(18,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');
    const estanteria26: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(18,0,21), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg');

    //Armarios
    const armario1: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(7,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'armario.obj', 'malla', 'grisclaro.jpeg');
    const armario2: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(14,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'armario.obj', 'malla', 'grisclaro.jpeg');
    const armario3: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(21,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'armario.obj', 'malla', 'grisclaro.jpeg');

    //Mueble baldosas
    const muebleBaldosas1: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(0,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'desk.obj', 'malla', 'grisclaro.jpeg');
    const muebleBaldosas2: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(20,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'supermarket_fridge.obj', 'malla', 'grisclaro.jpeg');
    const muebleBaldosas3: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(0,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'mueblebaldosas.obj', 'malla', 'grisclaro.jpeg');

    //Asignamos el motor al servicio después de cargarlo para que guarde valores
    //await this.motorService.asignarMotor(motor);
    console.log(motor)
    
    mercado.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
