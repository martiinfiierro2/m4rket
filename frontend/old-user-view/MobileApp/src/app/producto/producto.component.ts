
import { Component, Input } from '@angular/core';
//import { AppModule } from '../app.module';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {
  @Input() producto: Producto | undefined;
  mostrarContador = false;
  cantidadProducto: number = 1;

  incrementar() {
    this.cantidadProducto++;
  }

  decrementar() {
    if (this.cantidadProducto > 1) {
      this.cantidadProducto--;
    } else {
      this.mostrarContador = false; // Oculta el contador si la cantidad es cero
    }
  }

  eliminar() {
    this.cantidadProducto = 0;
  }
}

export interface Producto{
  id: number,
  nombre: string,
  marca: string,
  categoria: string,
  stock: number,
  valor_energetico: Float32Array,
  grasas: Float32Array,
  grasas_saturadas: Float32Array,
  hidratos_carbono: Float32Array,
  azucares: Float32Array,
  fibra: Float32Array,
  proteina: Float32Array,
  sal: Float32Array,
  precio_kg: Float32Array,
  ingerdientes: string,
  foto: string,
  precio: Float32Array,
  //Ubicacions: Ubicaciones[]
  //Promocions: Promociones[]
}

