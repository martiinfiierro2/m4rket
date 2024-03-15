import { TNodo } from './TNodo';
import { ECamara } from "./ECamara";
import { ELuz } from "./ELuz";
import { EModelo } from "./EModelo";

import { TGestorRecursos } from "./TGestorRecursos";
import * as glMatrix from 'gl-matrix';

export class TMotorTAG {

    private raiz: TNodo;
    private gestorRecursos: TGestorRecursos;

    crearNodo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3 ): TNodo{

        let nodoCreado;
        
        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }

        padre.agregarHijo(nodoCreado);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;
    }

    crearCamara( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, perspectiva: Boolean, paralela: Boolean, cercano: number, lejano: number){
        
        let nodoCreado, entidadCamara;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        entidadCamara = new ECamara( perspectiva, paralela, cercano, lejano); //falta añadir los atributos pasados por param.

        nodoCreado.setEntidad(entidadCamara);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        
        return nodoCreado;

    }

    crearLuz( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, intensidad: number, tipoLuz: string): TNodo{

        let nodoCreado, entidadLuz;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);

        entidadLuz = new ELuz(); //falta añadir los atributos pasados por param.
        nodoCreado.setEntidad(entidadLuz);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;

    }

    crearModelo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, nombreFichero: string): TNodo{

        let nodoCreado, recursoMalla, entidadModelo;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        recursoMalla = this.gestorRecursos.getRecurso(nombreFichero);
        entidadModelo = new EModelo(recursoMalla);
        nodoCreado.setEntidad(entidadModelo);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;

    }

}