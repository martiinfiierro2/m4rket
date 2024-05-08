import { TRecurso } from "./TRecurso";
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class TRecursoTextura extends TRecurso {
    
    constructor(nombre: string){
        super(nombre)
    }
    
    private url = 'https://m4rket.ovh/api/uploads/fotoproducto/'
    private http: HttpClient = {} as HttpClient; 
    private token: string | null = localStorage.getItem('tokenUsuario');
    private cabeceras = {
        'x-token': this.token || '',
    };

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

    override cargarFicheroAPI(filename: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            fetch(this.url+filename, { headers: this.cabeceras})
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
