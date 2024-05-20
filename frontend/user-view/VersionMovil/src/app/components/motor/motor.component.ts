import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto, ListaCompra } from '../drawer/drawer.component';
import { MotorService } from '../../services/motor.service';
import { Ubicacion } from 'src/app/home/home.page';
import { UbicacionesService } from 'src/app/services/ubicaciones.service';
import { TRecursoTextura } from './clases/TRecursoTextura';

export let motor: TMotorTAG;

interface pin {
  idProd: number;
  nodo: TNodo;
  padre: TNodo;
  recText: TRecursoTextura;
  x: number;
  y: number;
  z: number;
  color:string;

}
interface lista {
  id: string;
  estado: boolean;
}
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})
export class MotorComponent implements AfterViewInit {
  private suelo!: TNodo;
  private mercado!: TNodo;
  private ubicaciones: TNodo[] = [];
  private listaCompra: lista[] = [];
  private pines: pin[] = [];

  constructor(
    private productosService: ProductosService,
    private ubicacionService: UbicacionesService,
    @Inject(MotorService) private motorServicio: MotorService
  ) {}

  ngAfterViewInit(): void {

  }

  async crearEscena() {
    motor = new TMotorTAG();

    //Creamos nodo padre
    this.mercado = await motor.crearNodo(
      null,
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1)
    );
    //asignar camara
    const camara: TNodo = await motor.crearCamara(
      this.mercado,
      glMatrix.vec3.fromValues(-4.5, 12, -40),
      glMatrix.vec3.fromValues(15 * (Math.PI / 180), 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1),
      true,
      false,
      0.1,
      100
    );
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);

    //asignar luces
    const luzTop: TNodo = await motor.crearLuz(
      null,
      glMatrix.vec3.fromValues(200, 200, 200),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1.0, 1.0, 1.0),
      'Direccional',
      glMatrix.vec4.fromValues(20, 20, 20, 1)
    );
    await motor.registrarLuz(luzTop);
    await motor.setLuz(luzTop);

    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    this.suelo = await motor.crearModelo(
      this.mercado,
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(0, 215 * (Math.PI / 180), 0),
      glMatrix.vec3.fromValues(0.425, 0.425, 0.425),
      'suelo.obj',
      'malla',
      'gris.jpg'
    );

    const puerta: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 43),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(1, 1, 1),
      'puerta.obj',
      'malla',
      'grisclaro.jpeg'
    );

    //Fruta
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-1, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(6, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(13, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(20, 0, 38),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
        'mueblefrutas.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Estanterias pasillo 1
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 27),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 24),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Estanterias pasillo 2
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 17),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 14),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Estanterias pasillo 3
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 7),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-14, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-2, 0, 4),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Estanterias fondo
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 10),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 13),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 10),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 13),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 18),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(12, 0, 21),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 18),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(18, 0, 21),
        glMatrix.vec3.fromValues(0, 90 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(1, 1, 1),
        'estanteria.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Armarios
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(7, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(14, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(21, 0, -5),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'armario.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Frigos
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 12),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 15),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 18),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(28, 0, 21),
        glMatrix.vec3.fromValues(0, 0, 0),
        glMatrix.vec3.fromValues(2, 2, 2),
        'frigo.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Mueble dobles
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-1, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-8, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );
    this.ubicaciones.push(
      await motor.crearModelo(
        this.suelo,
        glMatrix.vec3.fromValues(-15, 0, -5),
        glMatrix.vec3.fromValues(0, 180 * (Math.PI / 180), 0),
        glMatrix.vec3.fromValues(3.3, 3.3, 3.3),
        'muebledoble.obj',
        'malla',
        'grisclaro.jpeg'
      )
    );

    //Cajas registradoras
    const caja1: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 6),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const caja2: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 12),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const caja3: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 18),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const caja4: TNodo = await motor.crearModelo(
      this.suelo,
      glMatrix.vec3.fromValues(-25, 0, 24),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(4, 4, 4),
      'cajaregistradora.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla1: TNodo = await motor.crearModelo(
      caja1,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla2: TNodo = await motor.crearModelo(
      caja2,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla3: TNodo = await motor.crearModelo(
      caja3,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );
    const pantalla4: TNodo = await motor.crearModelo(
      caja4,
      glMatrix.vec3.fromValues(-0.3, -1.5, -0.3),
      glMatrix.vec3.fromValues(0, 0, 0),
      glMatrix.vec3.fromValues(2, 2, 2),
      'ladrilloregistrador.obj',
      'malla',
      'blanco.jpeg'
    );

    const idUsu: string = await this.getUsuarioLog();
    //Para cada producto en lista compra
    const res: any = await this.productosService
      .getListaCompra(idUsu)
      .toPromise();
    for (let j = 0; j < res.listacompra.length; j++) {
      this.listaCompra.push({
        id: res.listacompra[j].idProd,
        estado: res.listacompra[j].comprado,
      });
    }

    await this.crearPines(this.listaCompra, 1);
    await this.mercado.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
  }
  





  async getUsuarioLog() {
    const idUsuario = localStorage.getItem('idUsuario');
    let idUsu = '';
    if (idUsuario !== null) {
      idUsu = idUsuario;
    } else {
      console.error('El valor de idUsuario en localStorage es nulo.');
    }
    return idUsu;
  }

  async eliminarPines(idProd: number){
    let pinBorrar = this.pines.find(pin => pin.idProd === idProd);
    const entidad = pinBorrar!.nodo.setEntidad(null);
    await pinBorrar!.padre.eliminarHijo(pinBorrar!.nodo);
    await this.mercado.recorrer(pinBorrar!.padre.getMatrizTransf());
  }

  letraANumero(letra: string): number {
    let numero!: number;
    if (letra == 'A') {
      numero = 0;
    } else if (letra == 'B') {
      numero = 10;
    } else if (letra == 'C') {
      numero = 20;
    } else if (letra == 'D') {
      numero = 30;
    } else if (letra == 'E') {
      numero = 40;
    }

    return numero;
  }

  async crearPines(lista: lista[], number: number) {
    const canvas = document.querySelector("#mercado") as HTMLCanvasElement;

    let valor!: number;
    for (let i = 0; i < lista.length; i++) {
        let nameMalla = 'pin.obj';

        const producto: any = await this.productosService.getProductoId(lista[i].id).toPromise();

        await producto.productos.Ubicacions.forEach((ubicacion: any) => {
            valor = this.letraANumero(ubicacion.referencia) + ubicacion.posicion;
        });

        let pin;
        if (valor <= 4) {
            pin = await motor.crearModelo(
                this.ubicaciones[valor],
                glMatrix.vec3.fromValues(0, 0, 0),
                glMatrix.vec3.fromValues(0, 45 * (Math.PI / 180), 0),
                glMatrix.vec3.fromValues(1, 1, 1),
                nameMalla,
                'malla',
                producto.productos.foto
            );
        } else if (valor > 4 && valor <= 30) {
            pin = await motor.crearModelo(
                this.ubicaciones[valor],
                glMatrix.vec3.fromValues(0, 0, 0),
                glMatrix.vec3.fromValues(0, -45 * (Math.PI / 180), 0),
                glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
                nameMalla,
                'malla',
                producto.productos.foto
            );
        } else if (valor > 30 && valor <= 33) {
            pin = await motor.crearModelo(
                this.ubicaciones[valor],
                glMatrix.vec3.fromValues(0, 2.5, 0),
                glMatrix.vec3.fromValues(0, 45 * (Math.PI / 180), 0),
                glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
                nameMalla,
                'malla',
                producto.productos.foto
            );
        } else if (valor > 33 && valor <= 37) {
            pin = await motor.crearModelo(
                this.ubicaciones[valor],
                glMatrix.vec3.fromValues(0, 2.5, 0),
                glMatrix.vec3.fromValues(0, 45 * (Math.PI / 180), 0),
                glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
                nameMalla,
                'malla',
                producto.productos.foto
            );
        } else if (valor > 37 && valor <= 40) {
            pin = await motor.crearModelo(
                this.ubicaciones[valor],
                glMatrix.vec3.fromValues(0, 1, 0),
                glMatrix.vec3.fromValues(0, 45 * (Math.PI / 180), 0),
                glMatrix.vec3.fromValues(1, 1, 1),
                nameMalla,
                'malla',
                producto.productos.foto
            );
        }

        const nodo = this.ubicaciones[valor];

        // Obtener las coordenadas de traslación (x, y, z)
        const traslacion = nodo.traslacion;
        
        // Suponiendo que traslacion es un arreglo de tamaño 3
        const x = traslacion[0];
        const y = traslacion[1];
        const z = traslacion[2];
        let idHex = ('0000' + producto.productos.id.toString()).padStart(6, '0');
        let color = '#' + idHex;
        
        
        this.pines.push({
            idProd: producto.productos.id,
            nodo: pin,
            padre: this.ubicaciones[valor],
            recText: producto.productos.foto,
            x: x,
            y: y,
            z: z,
            color: color
        });
    }
    console.log(this.pines);
    canvas.addEventListener('touchstart', this.detectarToque);

    // Para que solo recorra los nodos necesarios cuando se añade un producto SOLAMENTE
    if (number == 0) {
        await this.ubicaciones[valor].recorrer(this.ubicaciones[valor].getMatrizTransf());
    }
}

colorPick(x: number, y: number): string {
    console.log("Color picking en:", x, y);

    // Obtener el tamaño del viewport
    const viewport = motor.gl.getParameter(motor.gl.VIEWPORT);
    const width = viewport[2];
    const height = viewport[3];

    // Crear un buffer para almacenar los valores de color
    const pixelBuffer = new Uint8Array(4);

    // Leer el color del píxel en las coordenadas (x, y)
    motor.gl.readPixels(x, height - y, 1, 1, motor.gl.RGBA, motor.gl.UNSIGNED_BYTE, pixelBuffer);

    // Convertir los valores de color a hexadecimal
    const r = pixelBuffer[0];
    const g = pixelBuffer[1];
    const b = pixelBuffer[2];
    const a = pixelBuffer[3] / 255;
    const hexColor = this.rgbToHex(r, g, b, a);

    console.log("Color obtenido:", hexColor);
    return hexColor;
}

rgbToHex(r: number, g: number, b: number, a: number): string {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
}

componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

detectarToque = async (event: TouchEvent) => {
    console.log("Detectar toque");
    const canvas = document.querySelector("#mercado") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const selectedColor = this.colorPick(x, y);
    console.log("Color seleccionado:", selectedColor);

    this.updatePinColor(selectedColor);
}

updatePinColor(color: string) {
    console.log("Actualizando color del pin con color:", color);
    let selectedPin = null;

    // Buscar el pin con el color seleccionado
    for (const pin of this.pines) {
        if (pin.color === color) {
            selectedPin = pin;
            break; // Si se encuentra el pin, salir del bucle
        }
    }

    if (selectedPin) {
        console.log("Pin seleccionado encontrado:", selectedPin);
        // Hacer lo que quieras con el pin seleccionado
    } else {
        console.log("No se encontró ningún pin con el color seleccionado");
    }
}

  
  pinContieneCoordenadas(pin: any, x: number, y: number) {
    // Supongamos que el pin tiene un atributo de radio para definir su área
    const radio = 10; // Puedes ajustar este valor según el tamaño de los pines
    console.log(pin);
    // Calcula la distancia entre el punto de clic y el centro del pin
    const distanciaAlCentro = Math.sqrt((x - pin.x) ** 2 + (y - pin.y) ** 2);

    // Si la distancia al centro es menor o igual al radio, el clic está dentro del área del pin
    return distanciaAlCentro <= radio;
}


}
