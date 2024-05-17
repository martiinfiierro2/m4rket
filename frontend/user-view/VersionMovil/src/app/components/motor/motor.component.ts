import { AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import * as glMatrix from 'gl-matrix';
import { TMotorTAG } from './clases/TMotorTAG';
import { TNodo } from './clases/TNodo';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto} from '../drawer/drawer.component';
import { MotorService } from "../../services/motor.service";

export let motor: TMotorTAG;

interface lista{
  id: string,
  estado: boolean
}
@Component({
  selector: 'app-motor',
  templateUrl: './motor.component.html',
  styleUrls: ['./motor.component.scss'],
})

export class MotorComponent implements AfterViewInit{
  private suelo!: TNodo;
  private mercado!: TNodo;
  private ubicaciones: TNodo[] = [];
  private pins: TNodo[] = [];
  private listaCompra: lista[] = [];

  constructor(
    private productosService: ProductosService,
    @Inject(MotorService) private motorServicio: MotorService
  ) { }

  ngAfterViewInit(): void {
  }

  gestionarMarcado(IDProd: number){
    console.log(IDProd);
  }

  async crearEscena(){
    motor = new TMotorTAG();
 
    //Creamos nodo padre
    this.mercado = await motor.crearNodo( null, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1));

    //asignar camara
    const camara: TNodo = await motor.crearCamara(this.mercado, glMatrix.vec3.fromValues(-4.5,15,-55), glMatrix.vec3.fromValues(15*(Math.PI / 180),0,0), glMatrix.vec3.fromValues(1,1,1), true, false, 0.1, 100);
    await motor.registrarCamara(camara);
    await motor.setCamara(camara);
 
    //asignar luces
    const luzTop: TNodo = await motor.crearLuz(null, glMatrix.vec3.fromValues(200, 200, 200), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(1.0,1.0,1.0), "Direccional", glMatrix.vec4.fromValues(20,20,20,1));
    await motor.registrarLuz(luzTop);
    await motor.setLuz(luzTop);
  
    //Iniciamos GL y Programa
    await motor.iniciarGL();
    await motor.iniciarPrograma();

    this.suelo = await motor.crearModelo( this.mercado, glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(0,215*(Math.PI / 180),0), glMatrix.vec3.fromValues(0.425,0.425,0.425), 'suelo.obj', 'malla', 'gris.jpg', true);

    const puerta: TNodo = await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,43), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(1,1,1), 'puerta.obj', 'malla', 'grisclaro.jpeg', true);

    //Fruta
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-1,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(6,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(13,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(20,0,38), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2.5,2.5,2.5), 'mueblefrutas.obj', 'malla', 'grisclaro.jpeg', true));
    
    //Estanterias pasillo 1
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,27), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,24), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    
    //Estanterias pasillo 2
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,17), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,14), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Estanterias pasillo 3
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,7), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg',true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-14,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-2,0,4), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Estanterias fondo
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,10), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,13), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,10), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,13), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,18), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(12,0,21), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,18), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(18,0,21), glMatrix.vec3.fromValues(0,90*(Math.PI / 180),0), glMatrix.vec3.fromValues(1,1,1), 'estanteria.obj', 'malla', 'grisclaro.jpeg', true));

    //Armarios
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(7,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(14,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(21,0,-5), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'armario.obj', 'malla', 'grisclaro.jpeg', true));

    //Frigos
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,12), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg',true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,15), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(28,0,21), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(2,2,2), 'frigo.obj', 'malla', 'grisclaro.jpeg', true));

    //Mueble dobles
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-1,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-8,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));
    this.ubicaciones.push(await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-15,0,-5), glMatrix.vec3.fromValues(0,180*(Math.PI / 180),0), glMatrix.vec3.fromValues(3.3,3.3,3.3), 'muebledoble.obj', 'malla', 'grisclaro.jpeg', true));

    //Cajas registradoras
    const caja1: TNodo = await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,6), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja2: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,12), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja3: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,18), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);
    const caja4: TNodo =  await motor.crearModelo( this.suelo, glMatrix.vec3.fromValues(-25,0,24), glMatrix.vec3.fromValues(0,0,0), glMatrix.vec3.fromValues(4,4,4), 'cajaregistradora.obj', 'malla', 'blanco.jpeg', true);

    console.log(motor)
    await this.cargarNodosPines();
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

  public async cargarNodosPines() {
    try {
      const idUsu: string = await this.getUsuarioLog();
      //Para cada producto en lista compra
      this.productosService.getListaCompra(idUsu).subscribe( res => {
        console.log("Cantidad de productos en cargarNodosPines: " + res.listacompra.length);
        for(let j = 0; j < res.listacompra.length; j++){
          this.listaCompra.push(res.listacompra[j].idProd, res.listacompra[j].comprado);
        }
      });
      const res: any = await this.productosService.getAllProdSinPag().toPromise();

      for (let index = 0; index < res.productos.length; index++) {

        let pin!: TNodo;
        this.pins.push(pin);
      }

      
      for (let index = 0; index < res.productos.length; index++) {

        const producto: Producto = res.productos[index];
        let estado: boolean = false;
        let compradoTextura: string = producto.foto;
        let nombreMalla: string = 'pin.obj'

        for(let x = 0; x < this.listaCompra.length; x++){
          if(this.listaCompra.find(lista => lista.id === producto.id)){
            estado = true;
            if(this.listaCompra.find(lista => lista.estado === true)){
              nombreMalla = 'pin2.obj';
              compradoTextura = 'T.jpeg';
            }
          }
        }
        
        if(index <= 4){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 0, 0),
            glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(1, 1, 1),
            nombreMalla,
            'malla',
            compradoTextura,
            estado
          );
        }
        else if(index > 4 && index <= 30){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 0, 0),
            glMatrix.vec3.fromValues(0, -45*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(2.5, 2.5, 2.5),
            nombreMalla,
            'malla',
            compradoTextura,
            estado
          );
        }
        else if(index > 30 && index <= 33){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 2.5, 0),
            glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
            nombreMalla,
            'malla',
            compradoTextura,
            estado
          );
        }
        else if(index > 33 && index <= 37){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 2.5, 0),
            glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(1.5, 1.5, 1.5),
            nombreMalla,
            'malla',
            compradoTextura,
            estado
          );
        }
        else if(index > 37 && index <= 40){
          this.pins[index] = await motor.crearModelo(
            this.ubicaciones[index],
            glMatrix.vec3.fromValues(0, 1, 0),
            glMatrix.vec3.fromValues(0, 45*(Math.PI / 180), 0),
            glMatrix.vec3.fromValues(1, 1, 1),
            nombreMalla,
            'malla',
            compradoTextura,
            estado
          );
        }
      }

      console.log("Lista de la compra al final: " + this.listaCompra.length);

      await this.mercado.recorrer(glMatrix.mat4.identity(glMatrix.mat4.create()));
    } catch (error) {
      console.error('Error al cargar los nodos de pines:', error);
    }
  }
}
