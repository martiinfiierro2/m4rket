import { TRecurso } from "./TRecurso";
import { Malla } from './Malla';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';


export class TRecursoMalla extends TRecurso {
    
    private mallas: Malla[] = [];

    constructor(nombre: string) {
        super(nombre);
    }

<<<<<<< HEAD
    cargarFichero(nombreFichero: string) {
        // Combinar el nombre del archivo con la ruta relativa
        const rutas = nombreFichero;
        

        const objLoader = new ObjectLoader();
        objLoader.load(
            '../../assets/motor/conTextura.obj',
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
=======
    override cargarFichero(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(`../../assets/motor${filename}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const archivo = data;
                    const _malla: Malla = new Malla(archivo);
                    this.mallas.push(_malla);
                    resolve();
                })
                .catch(error => {
                    console.error("Error al cargar el archivo:", error);
                    reject(error);
                });
            });
>>>>>>> 73fce9251fb48903f9f911a63e260de48dc96871
    }
     

    draw(): void{
        for(let i = 0; i < this.mallas.length; i++){
            this.mallas[i].dibujar();
        }
    }
}
