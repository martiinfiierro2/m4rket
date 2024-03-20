import { AfterViewInit, Component, OnInit, Input, Output} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { mat4 } from 'three/examples/jsm/nodes/shadernode/ShaderNode';

@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})
export class MotorComponent  implements OnInit{

  constructor() { }

  ngOnInit(): void {
    this.crearEscena();
  }

  crearEscena(){
    const canvas = document.querySelector("#mercado") as HTMLCanvasElement;
    console.log(canvas)
    const motor = new TMotorTAG();
    motor.iniciarCanva(canvas);

    const personaje: TNodo = motor.crearNodo( null, glMatrix.vec3.fromValues(10,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));
    const cuerpo: TNodo = motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'conTextura.obj');
    const sombrero: TNodo = motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,10,0), glMatrix.vec3.fromValues(0,0,Math.PI/8), glMatrix.vec3.fromValues(1,1,1), undefined);
    console.log('personaje: ' + personaje + ', cuerpo: ' + cuerpo + ', sombrero: ' + sombrero);
    personaje.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));//Matriz identidad
  }

}
