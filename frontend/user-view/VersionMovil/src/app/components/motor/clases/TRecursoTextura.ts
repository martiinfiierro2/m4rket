import { TRecurso } from "./TRecurso";

export class TRecursoTextura extends TRecurso {
    
    constructor(nombre: string){
        super(nombre)
    }

    private width!: number;
    private height!: number;

    //Variables tipo imagen
    private imagenTextura!: Blob;

    async getImagenTextura(){
        return this.imagenTextura;
    }

    async getWidth(){
        return this.width;
    }

    async getHeight(){
        return this.height;
    }

    override cargarFichero(filename: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            fetch(`../../assets/motor/texturas/${filename}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then((blob) => {
                    resolve(blob);
                })
                .catch(error => {
                    console.error("Error al cargar el archivo:", error);
                    reject(error);
                });
        });
    }
    draw(): void {
    }
}
