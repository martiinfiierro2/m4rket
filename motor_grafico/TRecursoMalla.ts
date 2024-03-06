import { TRecurso } from "./TRecurso";
import { Malla } from "./Malla";
import * as fs from 'fs-js';

export class TRecursoMalla extends TRecurso{
    

    private mallas: Malla[];

    constructor( nombre:string ){
        super(nombre);
    }


    cargarFichero( nombreFichero :string ){
        //Formato JSON --> JSON

        //Leer recurso
        //Para cada malla
            //Crear malla nueva
            //Guardar vértices, normales y coordenadas de texturas
            //Guardar texturas y materiales
            //Guardar malla en el array 

        const fileContent: string = fs.readFileSync(nombreFichero, 'utf8');
        const lines: string[] = fileContent.split('\n');
        
        lines.forEach((line: string) => {

            let nuevaMalla = new Malla();

            const parts: string[] = line.trim().split(/\s+/);
            const type: string = parts[0];
        
            switch (type) {
                //vertices
                case 'v':
                    let vertex: number[] = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    nuevaMalla.setVertices(vertex);
                    break;

                //coordenada textura
                case 'vt':
                    let textureCoordinate: number[] = [parseFloat(parts[1]), parseFloat(parts[2])];
                    nuevaMalla.setCordTex(textureCoordinate);
                    break;

                //normales
                case 'vn':
                    let normal: number[] = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]
                    nuevaMalla.setNormales(normal);
                    break;

                //caras
                case 'f':
                    const vertexIndices: number[] = parts.slice(1).map((part: string) => parseInt(part.split('/')[0]));
                    nuevaMalla.setIndices(vertexIndices);
                    break;
                    
            }   
            this.mallas.push(nuevaMalla);
        });
        
    }

    draw(): void {
        for (let i = 0; i < this.mallas.length; i++) {
            this.mallas[i].dibujar();
        }
    }
}