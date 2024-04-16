import { Injectable } from '@angular/core';
import { TMotorTAG } from '../components/motor/clases/TMotorTAG';

@Injectable({
  providedIn: 'root'
})
export class MotorService {

  // Declara una variable para almacenar el motor
  private motor!: TMotorTAG;

  constructor() {}

  async asignarMotor(motor: TMotorTAG) {
    this.motor = motor;
  }

  obtenerMotor(): TMotorTAG {
    return this.motor;
  }
}
