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

    //Creamos recursos
    await motor.gestorRecursos.getRecurso("T.jpeg", "textura");
    await motor.gestorRecursos.getRecurso("andres.jpg", "textura");
    await motor.gestorRecursos.getRecurso("madera.jpeg", "textura");
 
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

    const suelo: TNodo = await motor.crearModelo( mercado, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,215*(Math.PI / 180),0), glMatrix.vec3.fromValues(0.35,0.35,0.35), 'conTextura.obj', 'malla', 'gris.jpg');
    const puerta: TNodo = await motor.crearModelo( suelo, glMatrix.vec3.fromValues(10,10,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1.5,1.5,1.5), 'untitled.obj', 'malla', 'gris.jpg');

    //Asignamos el motor al servicio después de cargarlo para que guarde valores
    //await this.motorService.asignarMotor(motor);
    console.log(motor)
    
    mercado.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
