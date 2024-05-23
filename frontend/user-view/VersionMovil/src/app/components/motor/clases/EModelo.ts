import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoTextura } from "./TRecursoTextura";

export class EModelo {

    private recursoMalla!: TRecursoMalla;
    private recursoTextura!: TRecursoTextura;

    constructor(recursoMalla: any, recursoTextura: any) {
        this.recursoMalla = recursoMalla;
        this.recursoTextura = recursoTextura;
    }

    cargarFichero( fichero: any ){
    }

    async dibujar(matTrans: any, id: number): Promise<void>{
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
            this.recursoMalla.draw(id, matTrans, this.recursoTextura.getNombre());
        }
        else {
            console.log("Fallo dibujando la malla");
        }
    }
}