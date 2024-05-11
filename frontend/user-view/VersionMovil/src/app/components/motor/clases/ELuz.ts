import { TEntidad } from "./TEntidad";
import * as glMatrix from 'gl-matrix';

export class ELuz extends TEntidad {
    
    
    private intensidad!: glMatrix.vec3; 
    private tipoLuz!: string;
    private apertura!: number; //Flotante
    private atenAngular!: number; //Flotante
    private atenCte!: number; //Flotante
    private atenLineal!: number; //Flotante
    private atenCuadrat!: number; //Flotante


    dibujar(){
        
    }

    //SETTERS
    setIntensidad( intesidad: glMatrix.vec3){
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
    getIntensidad(){
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