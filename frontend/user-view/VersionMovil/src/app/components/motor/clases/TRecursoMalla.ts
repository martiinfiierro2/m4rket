import { TRecurso } from "./TRecurso";
import { Malla } from './Malla';

export class TRecursoMalla extends TRecurso {
    
    private mallas: Malla[] = [];

    constructor(nombre: string) {
        super(nombre);
    }

    override cargarFichero(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(`../../assets/motor/objetos/${filename}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const archivo = data;
                    const _malla: Malla = new Malla(archivo);// añadir malla y material
                    this.mallas.push(_malla);
                    resolve();
                })
                .catch(error => {
                    console.error("Error al cargar el archivo:", error);
                    reject(error);
                });
        });
    }
     
    draw(matTrans: any, textura: any): void{
        for(let i = 0; i < this.mallas.length; i++){
            this.mallas[i].dibujar(textura, matTrans);
        }
    }
}
