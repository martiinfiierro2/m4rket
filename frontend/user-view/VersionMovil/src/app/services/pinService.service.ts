import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PinService {
  constructor() {}

  handlePinClick(pinId: number): void {
    console.log(`Pin ${pinId} clicked`);
    // Aquí puedes agregar la lógica adicional que necesites
  }
}
