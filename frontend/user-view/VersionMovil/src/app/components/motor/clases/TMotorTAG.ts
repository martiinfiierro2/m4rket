import { TNodo } from './TNodo';
import { ECamara } from "./ECamara";
import { ELuz } from "./ELuz";
import { EModelo } from "./EModelo";
import { TRecursoShader } from './TRecrusoShader';

import { TGestorRecursos } from "./TGestorRecursos";
import * as glMatrix from 'gl-matrix';

export class TMotorTAG {

    private raiz!: TNodo;
    private gestorRecursos = new TGestorRecursos();
    private shader = new TRecursoShader();
    
    iniciarCanva(canvas: any){
        let gl = canvas.getContext("webgl");
        if (!gl) {
            console.error('No se pudo obtener el contexto WebGL.');
            return;
        }
        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }`
        ;

        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
            }`
        ;
        if (!vertexShaderSource || !fragmentShaderSource) {
            console.error('No se pudo obtener el código fuente de los shaders.');
            return;
        }
        else{
            this.shader.crearShaders(gl, vertexShaderSource, fragmentShaderSource);
        }
    }

    crearRaiz(nodoRaiz: TNodo){
        this.raiz = nodoRaiz;
    }

    crearNodo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3 ): TNodo{

        let nodoCreado: any;
        
        nodoCreado = new TNodo();
        if (padre == null) {
            this.crearRaiz(nodoCreado);
        }
        else{
            padre.agregarHijo(nodoCreado);
        }

        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;
    }

    crearCamara( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, perspectiva: Boolean, paralela: Boolean, cercano: number, lejano: number){
        
        let nodoCreado: any, entidadCamara: any;

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

    crearModelo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, nombreFichero: string | undefined): TNodo{

        let nodoCreado: any, recursoMalla: any, entidadModelo: any;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        if(nombreFichero != undefined){
            recursoMalla = this.gestorRecursos.getRecurso(nombreFichero);
        }
        entidadModelo = new EModelo(recursoMalla);
        nodoCreado.setEntidad(entidadModelo);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);

        return nodoCreado;

    }

}