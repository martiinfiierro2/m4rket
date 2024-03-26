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

  ngOnInit(){
    this.crearEscena();
  }

  async crearEscena(){
    const motor = new TMotorTAG();

    const canvas = document.querySelector("#mercado") as HTMLCanvasElement;
    await motor.iniciarCanva(canvas);

    const personaje: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(10,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));
    const cuerpo: TNodo = await motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'plano.obj');

    personaje.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
