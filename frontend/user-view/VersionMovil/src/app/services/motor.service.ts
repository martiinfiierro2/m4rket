import { Injectable } from '@angular/core';
import { MotorComponent } from '../components/motor/motor.component';
import { TMotorTAG } from '../components/motor/clases/TMotorTAG';
import { mat4, vec3 } from 'gl-matrix';
import { DrawerComponent } from '../components/drawer/drawer.component';

export let motor: TMotorTAG;

@Injectable({
  providedIn: 'root'
})
export class MotorService {

  private motor!: MotorComponent;
  private drawer!: DrawerComponent

  constructor(){
  }

  setDrawer(drawerNuevo: DrawerComponent) {
    this.drawer = drawerNuevo
  }

  setMotor(motorNuevo: MotorComponent) {
    this.motor = motorNuevo;
  }

  getDrawer() {
    return this.drawer;
  }

  getMotor() {
    return this.motor;
  }
}
