// rotacion.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RotacionService {
  rotacion: number = 0;

  constructor() { }

  getRotacion(): number {
    return this.rotacion;
  }

  setRotacion(rotacion: number): void {
    this.rotacion = rotacion;
  }
}
