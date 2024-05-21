import { Injectable } from '@angular/core';
import { MotorComponent } from '../components/motor/motor.component';
import { TMotorTAG } from '../components/motor/clases/TMotorTAG';
import { mat4, vec3 } from 'gl-matrix';

export let motor: TMotorTAG;

@Injectable({
  providedIn: 'root'
})
export class MotorService {

  private motor!: MotorComponent;

  constructor(){
  }

  setMotor(motorNuevo: MotorComponent) {
    this.motor = motorNuevo;
  }

  getMotor() {
    return this.motor;
  }
}
