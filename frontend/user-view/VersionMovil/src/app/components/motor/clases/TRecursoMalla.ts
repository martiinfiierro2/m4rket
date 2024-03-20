import { TRecurso } from "./TRecurso";
import { Malla } from "./Malla";
import { ObjectLoader } from "three";

export class TRecursoMalla extends TRecurso {
    
    private mallas: Malla[] = [];

    constructor(nombre: string) {
        super(nombre);
    }

    cargarFichero(nombreFichero: string) {
        // Combinar el nombre del archivo con la ruta relativa
        const ruta = './' + nombreFichero;
        
        const objLoader = new ObjectLoader();
        objLoader.load(
            ruta,
            (mesh: any) => {
                const geometry = mesh.geometry;
                const vertices = geometry.attributes.position.array;
                const normal = geometry.attributes.normal.array;
                const texturasCoordinate = geometry.attributes.uv.array;
                const indices = geometry.index.array;

                const nuevaMalla = new Malla(); // Inicializamos una malla nueva dentro del callback de carga
                nuevaMalla.setIndices(indices);
                nuevaMalla.setNormales(normal);
                nuevaMalla.setCordTex(texturasCoordinate);
                nuevaMalla.setVertices(vertices);
                this.mallas.push(nuevaMalla);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            (error) => {
                console.error('Error al cargar el modelo', error);
            }
        );
    }

    draw(): void {
        for (let i = 0; i < this.mallas.length; i++) {
            this.mallas[i].dibujar();
        }
    }
}
