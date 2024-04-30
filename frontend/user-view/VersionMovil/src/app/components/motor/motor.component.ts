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
    const personaje: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));

    //asignar camara
    const camara: TNodo = await motor.crearCamara(personaje, glMatrix.vec3.fromValues(0,0,-6), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), true, false, 1, 1000);
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);
 
    //asignar luces
  
    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    const cara: TNodo = await motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0.5,0.5,0.5), 'conTextura.obj', 'malla', 'andres.jpg');
    const nariz: TNodo = await motor.crearModelo( cara, glMatrix.vec3.fromValues(2,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'conTextura.obj', 'malla', 'madera.jpeg');

    //Asignamos el motor al servicio después de cargarlo para que guarde valores
    //await this.motorService.asignarMotor(motor);
    console.log(motor)
    
    personaje.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
