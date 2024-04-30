import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoTextura } from "./TRecursoTextura";

export class EModelo {

    private recursoMalla = new TRecursoMalla("Mallas");
    private recursoTextura = new TRecursoTextura("Texturas");

    constructor(recursoMalla: any, recursoTextura: any) {
        this.recursoMalla = recursoMalla;
        this.recursoTextura = recursoTextura;
    }

    cargarFichero( fichero: any ){
    }

    async dibujar(matTrans: any): Promise<void>{
        console.log(this.recursoMalla.getNombre());
        await new Promise<void>(resolve => {
            if(this.recursoMalla) {
                resolve();
            }
            else {
                const intervalo = setInterval(() => {
                    if(this.recursoMalla) {
                        clearInterval(intervalo);
                        resolve();
                    }
                }, 100)
            }
        })

        if(this.recursoMalla) {
            this.recursoMalla.draw(matTrans, this.recursoTextura.getNombre());
        }
        else {
            console.log("Fallo dibujando la malla");
        }
    }
}