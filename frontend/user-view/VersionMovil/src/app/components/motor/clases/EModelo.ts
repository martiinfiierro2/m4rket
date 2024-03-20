import { TRecursoMalla } from "./TRecursoMalla";

export class EModelo {

    private recursoMalla = new TRecursoMalla("Mallas");

    constructor(recurso: any) {
        this.recursoMalla = recurso;
    }

    cargarModelo( fichero: any ){

    }

    dibujar(){//llama a recurso malla
        if(this.recursoMalla != undefined){
            this.recursoMalla.draw();
        }
    }
}