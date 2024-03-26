import { TRecurso } from "./TRecurso";

export class TRecursoTextura extends TRecurso {
    

    private id!: string;
    private width!: string;
    private height!: string;

    //Variables tipo imagen
    private imagenTextura!: Blob;


    async cargarFichero( nombre:string): Promise<void>{

        //Formato imagen: JPG, PNG... --> JS

    }

    draw(): void {
       
    }
}