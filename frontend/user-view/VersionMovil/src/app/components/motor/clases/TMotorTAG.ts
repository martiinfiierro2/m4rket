import { TNodo } from './TNodo';
import { ECamara } from "./ECamara";
import { ELuz } from "./ELuz";
import { EModelo } from "./EModelo";
import { TRecursoShader } from './TRecrusoShader';
import { Malla } from './Malla'

import { TGestorRecursos } from "./TGestorRecursos";
import * as glMatrix from 'gl-matrix';

export class TMotorTAG {

    private raiz!: TNodo;
    private gestorRecursos = new TGestorRecursos();
    private shader = new TRecursoShader();
    
    async iniciarCanva(canvas: any){
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
            await this.shader.crearShaders(gl, vertexShaderSource, fragmentShaderSource);
        }
    }

    sendShader(){
        return this.shader;
    }

    async crearRaiz(nodoRaiz: TNodo){
        this.raiz = nodoRaiz;
    }

    async crearNodo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3 ){
        let nodoCreado: any;
        
        nodoCreado = new TNodo();
        if (padre == null) {
            await this.crearRaiz(nodoCreado);
        }
        else{
            await padre.agregarHijo(nodoCreado);
        }

        await nodoCreado.setTraslacion(trasl);
        await nodoCreado.setRotacion(rot);
        await nodoCreado.setEscalado(esc);

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

    async crearModelo( padre: TNodo|null, trasl: glMatrix.vec3, rot: glMatrix.vec3, esc: glMatrix.vec3, nombreFichero: string | undefined){
        let nodoCreado: any, recursoMalla: any, entidadModelo: any;

        nodoCreado = new TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        await padre.agregarHijo(nodoCreado);
        if(nombreFichero != undefined){
            recursoMalla = await this.gestorRecursos.getRecurso(nombreFichero);
        }
        entidadModelo = new EModelo(recursoMalla);
        await nodoCreado.setEntidad(entidadModelo);
        await nodoCreado.setTraslacion(trasl);
        await nodoCreado.setRotacion(rot);
        await nodoCreado.setEscalado(esc);

        return nodoCreado;
    }

}