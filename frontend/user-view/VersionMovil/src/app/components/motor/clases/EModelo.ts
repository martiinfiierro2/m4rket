import { TRecursoMalla } from "./TRecursoMalla";

export class EModelo {

    private recursoMalla = new TRecursoMalla("Mallas");

    constructor(recurso: any) {
        this.recursoMalla = recurso;
    }

    cargarFichero( fichero: any ){
    }

    async dibujar(): Promise<void>{
        await new Promise<void>(resolve => {
            if(this.recursoMalla) {
                console.log(this.recursoMalla)
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
            this.recursoMalla.draw();
        }
        else {
            console.log("Fallo dibujando la malla");
        }
    }
}