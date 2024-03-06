import { TEntidad } from "./TEntidad";
import * as glMatrix from 'gl-matrix';

class TLuz extends TEntidad {
    
    
    private intensidad: glMatrix.vec4; //rgb alpha
    private tipoLuz; //Enum
    private apertura: number; //Flotante
    private atenAngular: number; //Flotante
    private atenCte: number; //Flotante
    private atenLineal: number; //Flotante
    private atenCuadrat: number; //Flotante


    dibujar(matTransf: glMatrix.mat4): void {
        
    }

    //SETTERS
    setIntensidad( intesidad: glMatrix.vec4){
        this.intensidad = intesidad;
    }

    setTipoLuz( tLuz){
        this.tipoLuz = tLuz;
    }

    setApertura( ap ){
        this.apertura = ap;
    }

    setAtenAngular( atAng ){
        this.atenAngular = atAng;
    }

    setAtenCte( atCte ){
        this.atenCte = atCte;
    }

    setAtenLineal( atLin ){
        this.atenLineal = atLin;
    }

    setAtenCuadrat( atCuadr ){
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