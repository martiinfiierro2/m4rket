import { TRecurso } from "./TRecurso";

export class TRecursoShader extends TRecurso{
    
    private id: number;
    private vShader: string;
    private fShader: string;
    
    constructor( nombre:string ){
        super(nombre);
    }

    cargarFichero(nombre: string): void {

        //Formato GL/SL (texto)
    }

    draw(): void {
        
    }

    //Métodos para asignar valores a uniforms

}