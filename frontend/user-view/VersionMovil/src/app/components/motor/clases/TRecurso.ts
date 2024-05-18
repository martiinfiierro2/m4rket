
import { Injectable } from '@angular/core';

@Injectable()
export abstract class TRecurso {

    private nombre: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    abstract cargarFichero(nombre: string): Promise<any>;

    abstract cargarFicheroAPI(nombre: string): any;

    getNombre(): string{
        return this.nombre;
    }

    setNombre( nombre:string ){
        this.nombre = nombre;
    }

}