import { TRecurso } from "./TRecurso";

export class TRecursoMaterial extends TRecurso{

   private Ka!: number;
   private Kd!: number;
   private Ks!: number;

   private Ns!: number;
   private d!: number;

   //Variables tipo imagen
   private mapaKa!: Blob;
   private mapaKd!: Blob;
   private mapaKs!: Blob;
   
   async cargarFicheroAPI(nombre: string): Promise<any>{}

    async cargarFichero( nombre:string ): Promise<void>{
        
        //Formato MTL --> JSON

    }

    draw(): void {
        
    }
}