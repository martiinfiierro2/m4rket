import { TEntidad } from "./TEntidad";
import * as glMatrix from 'gl-matrix';

export class TCamara extends TEntidad {
    
    private esPerspectiva: Boolean = false;
    private esParalela: Boolean = false;
    private izquierda: Number;
    private derecha: Number;
    private inferior: Number;
    private superior: Number;
    private cercano: Number;
    private lejano: Number;

    setPerspectiva (){
        this.esPerspectiva = true;
        this.esParalela = false;
    }

    setParalela (){
        this.esParalela = true;
        this.esPerspectiva = false;
    }

    dibujar ( mat: glMatrix.mat4){

    }
}