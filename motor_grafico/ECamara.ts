import { TEntidad } from "./TEntidad";
import * as glMatrix from 'gl-matrix';

export class ECamara extends TEntidad {
    
    private esPerspectiva: Boolean = false;
    private esParalela: Boolean = false;
    private izquierda: Number;
    private derecha: Number;
    private inferior: Number;
    private superior: Number;
    private cercano: Number;
    private lejano: Number;


    constructor( perspectiva: Boolean, paralela: Boolean, cercano: Number, lejano: Number){
        super();
        this.esPerspectiva = perspectiva;
        this.esParalela = paralela;
        this.izquierda = 0;
        this.derecha = 0;
        this.inferior = 0;
        this.superior = 0;
        this.cercano = cercano;
        this.lejano = lejano;
    }

    setPerspectiva (){
        this.esPerspectiva = true;
        this.esParalela = false;
    }

    setParalela (){
        this.esParalela = true;
        this.esPerspectiva = false;
    }

    setIzquierda( izq: number){
        this.izquierda = izq;
    }

    setDerecha( dcha: number){
        this.derecha = dcha;
    }

    setInferior( inf: number){
        this.inferior = inf;
    }

    setSuperior( sup: number){
        this.superior = sup;
    }

    setCercanco( cerc: number){
        this.cercano = cerc;
    }

    setLejano( lej: number){
        this.lejano = lej;
    }

    dibujar ( mat: glMatrix.mat4){

    }
}