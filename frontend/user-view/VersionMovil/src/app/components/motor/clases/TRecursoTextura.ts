import { TRecurso } from "./TRecurso";

export class TRecursoTextura extends TRecurso {
    constructor(nombre: string){
        super(nombre)
    }

    private width!: number;
    private height!: number;

    //Variables tipo imagen
    private imagenTextura!: Blob;

    cargarImagenDesdeArchivo(archivo: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const imagen = new Image();
                imagen.onload = () => {
                    this.width = imagen.width;
                    this.height = imagen.height;
                    this.imagenTextura = archivo;
                    resolve();
                };
                imagen.onerror = (error) => {
                    reject(error);
                };
                imagen.src = evento.target!.result as string;
            };
            lector.readAsDataURL(archivo);
        });
    }

    override cargarFichero(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(`../../assets/motor/texturas/${filename}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(data => {
                    return this.cargarImagenDesdeArchivo(new File([data], filename));
                })
                .then(() => {
                    resolve();
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
