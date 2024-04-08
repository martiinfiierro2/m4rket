import { AfterViewInit, Component, OnInit, Input, Output} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';

export let motor: TMotorTAG;
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})

export class MotorComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
      
  }

  async crearEscena(){
    motor = new TMotorTAG();

    //Creamos recursos
    await motor.gestorRecursos.getRecurso("R.jpg", "textura");

    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();
 
    const personaje: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(10,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));
    const cara: TNodo = await motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'cubo2.obj', 'malla');
    const nariz: TNodo = await motor.crearModelo( personaje, glMatrix.vec3.fromValues(10,10,0), glMatrix.vec3.fromValues(1,0,0), glMatrix.vec3.fromValues(3,3,3), 'plano.obj', 'malla');
    
    personaje.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
