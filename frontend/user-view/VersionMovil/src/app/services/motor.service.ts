import { Injectable } from '@angular/core';
import { MotorComponent } from '../components/motor/motor.component';
import { TMotorTAG } from '../components/motor/clases/TMotorTAG';
export let motor: TMotorTAG;

@Injectable({
  providedIn: 'root'
})
export class MotorService {

  private motor!: MotorComponent;

  setMotor(motorNuevo: MotorComponent){
    this.motor = motorNuevo;
  }
  
  getMotor(){
    return this.motor;
  }
}
