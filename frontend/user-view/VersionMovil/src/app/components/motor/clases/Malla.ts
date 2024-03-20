import * as glMatrix from 'gl-matrix';
import { TRecursoShader } from './TRecrusoShader';
import { Output } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()

export class Malla {

    private vertices: number[] = [];
    private normales: number[] = [];
    private cordTex: number[] = [];
    private indices: number[] = [];
    @Output() program: any;
    @Output() gl: any;
    //private texturas: Textura[];

    dibujar(){
        //console.log(this.vertices, this.normales, this.cordTex, this.indices)
        /*console.log(this.program);
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.getVertices()), this.gl.STATIC_DRAW);
    
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);*/
    }


    setVertices( vecVertices: number[] ){
        this.vertices = vecVertices;
    }

    setNormales( vecNormales: number[]){
        this.normales = vecNormales;
    }

    setCordTex( vecCordTex: number[] ){
        this.cordTex = vecCordTex;
    }

    setIndices( vecIndices: number[] ){
        this.indices = vecIndices;
    }

    getVertices(){
        return this.vertices;
    }

    getNormales(){
        return this.normales;
    }

    getCordTex(){
        return this.cordTex;
    }

    getIndices(){
        return this.indices;
    }

    



}