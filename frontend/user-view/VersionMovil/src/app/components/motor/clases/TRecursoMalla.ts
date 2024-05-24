import { TRecurso } from "./TRecurso";
import { Malla } from './Malla';

export class TRecursoMalla extends TRecurso {
    
    private mallas: Malla[] = [];

    constructor(nombre: string) {
        super(nombre);
    }

    eliminarMalla(malla: Malla){
        for(let i = 0; i < this.mallas.length; i++){
            if(this.mallas[i] == malla){
                console.log(this.mallas[i])
                this.mallas.splice(i, 1);
                break;
            }
        }
    }

    async cargarFicheroAPI(nombre: string): Promise<any>{}

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
                        const _malla: Malla = new Malla(archivo, filename);// añadir malla y material
                        this.mallas.push(_malla);
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error al cargar el archivo:", error);
                        reject(error);
                    });
            });
        
    }
     
    draw(id: number, matTrans: any, textura: any): void{
        for(let i = 0; i < this.mallas.length; i++){
            this.mallas[i].dibujar(id, textura, matTrans);  
        }
    }
}
