import { AfterViewInit, Component, OnInit, Input, Output} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { MotorService } from 'src/app/services/motor.service';

export let motor: TMotorTAG;//Injectable
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})

export class MotorComponent implements OnInit{
  constructor(private motorService: MotorService) { }

  ngOnInit(): void {
      
  }

  async crearEscena(){
    motor = new TMotorTAG();

    //Creamos recursos
    await motor.gestorRecursos.getRecurso("R.jpg", "textura");
 
    //Creamos nodo padre
    const personaje: TNodo = await motor.crearNodo( null, glMatrix.vec3.fromValues(10,0,10), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));

    //asignar camara
    const camara: TNodo = await motor.crearCamara(personaje, glMatrix.vec3.fromValues(10,20,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), true, false, 1, 1000);
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);
 
    //asignar luces
 
    //asignar viewports

    const cara: TNodo = await motor.crearModelo( personaje, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'plano.obj', 'malla');
    const nariz: TNodo = await motor.crearModelo( cara, glMatrix.vec3.fromValues(10,10,0), glMatrix.vec3.fromValues(1,0,0), glMatrix.vec3.fromValues(3,3,3), 'cubo2.obj', 'malla');
    
    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    //Asignamos el motor al servicio después de cargarlo para que guarde valores
    await this.motorService.asignarMotor(motor);

    personaje.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
}
