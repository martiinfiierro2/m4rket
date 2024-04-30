import { TRecurso } from "./TRecurso";
export class TRecursoShader extends TRecurso{
    
    public valor!: string;

    constructor(nombre: string){
        super(nombre)
    }

    override cargarFichero(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(`../../assets/motor/shaders/${filename}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    this.valor = data;
                    resolve();
                })
                .catch(error => {
                    console.error("Error al cargar el archivo:", error);
                    reject(error);
                });
        });
    }
}