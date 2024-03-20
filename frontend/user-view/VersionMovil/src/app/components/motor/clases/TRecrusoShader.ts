import { TRecurso } from "./TRecurso";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TMotorTAG } from "./TMotorTAG";
import { Injectable } from '@angular/core';

@Injectable()

export class TRecursoShader extends TRecurso{
    
    private id!: number;
    private vertexShader!: any;
    private fragmentShader!: any;
    
    @Input() program: any;
    @Input() gl: any;

    constructor(){
        super("Shaders")
    }

    cargarFichero(nombre: string): void {

        //Formato GL/SL (texto)
    }

    crearShaders(gl: any, vertexShaderSource: any, fragmentShaderSource: any){

        this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!this.vertexShader || !this.fragmentShader) {
            console.error('No se pudo crear uno o ambos shaders.');
            return;
        }
        
        this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader);

        if (!this.program) {
            console.error('No se pudo crear el programa.');
            return;
        }
    }

    createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
        const shader = gl.createShader(type);
        if (!shader) {
            console.error('No se pudo crear el shader.');
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
    
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const program = gl.createProgram();
        if (!program) {
            console.error('No se pudo crear el programa.');
            return null;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
    
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
}