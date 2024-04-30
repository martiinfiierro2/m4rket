import { TEntidad } from "./TEntidad";
import * as glMatrix from 'gl-matrix';

export class ELuz extends TEntidad {
    
    
    private intensidad!: glMatrix.vec4; //rgb alpha
    private tipoLuz!: any; //Enum
    private apertura!: number; //Flotante
    private atenAngular!: number; //Flotante
    private atenCte!: number; //Flotante
    private atenLineal!: number; //Flotante
    private atenCuadrat!: number; //Flotante


    dibujar(){
        
    }

    //SETTERS
    setIntensidad( intesidad: glMatrix.vec4){
        this.intensidad = intesidad;
    }

    setTipoLuz( tLuz: any){
        this.tipoLuz = tLuz;
    }

    setApertura( ap: any ){
        this.apertura = ap;
    }

    setAtenAngular( atAng: any ){
        this.atenAngular = atAng;
    }

    setAtenCte( atCte: any ){
        this.atenCte = atCte;
    }

    setAtenLineal( atLin: any ){
        this.atenLineal = atLin;
    }

    setAtenCuadrat( atCuadr: any ){
        this.atenCuadrat = atCuadr;
    }



    //GETTERS
    getIntensidad(): glMatrix.vec4{
        return this.intensidad;
    }

    getTipoLuz(){
        return this.tipoLuz;
    }

    getApertura(){
        return this.apertura;
    }

    getAtenAngular(){
        return this.atenAngular;
    }

    getAtenCte(){
        return this.atenCte;
    }

    getAtenLineal(){
        return this.atenLineal;
    }

    getAtenCuadrat(){
        return this.atenCuadrat;
    }


}