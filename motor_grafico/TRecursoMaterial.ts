import { TRecurso } from "./TRecurso";

export class TRecursoMaterial extends TRecurso{

   private Ka: number;
   private Kd: number;
   private Ks: number;

   private Ns: number;
   private d: number;

   //Variables tipo imagen
   private mapaKa: Blob;
   private mapaKd: Blob;
   private mapaKs: Blob;


    constructor( nombre:string ){
        super(nombre);
    }

    cargarFichero( nombre:string ){
        
        //Formato MTL --> JSON

    }

    draw(): void {
        
    }
}