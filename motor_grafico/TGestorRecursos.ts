import { TRecurso } from "./TRecurso";
import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoMaterial } from "./TRecursoMaterial";
import { TRecursoTextura } from "./TRecursoTextura";

export class TGestorRecursos{

    private recursos: TRecurso[];

    constructor(parameters) {
        
    }

    getRecurso( nombre:string ){

        let res:TRecurso|undefined;

        res = this.recursos.find((recurso) => recurso.getNombre() == nombre);

        //si no existe se crea
        if (res == undefined) {
            res = this.crearRecurso(nombre)
            res.cargarFichero(nombre)
            this.anyadirRecurso(res);
        }

        return res;
    }

    crearRecurso(nombre: string): TRecurso {
        switch (nombre) {
            case "malla":
                return new TRecursoMalla(nombre);
            case "material":
                return new TRecursoMaterial(nombre);
            case "textura":
                return new TRecursoTextura(nombre);
            default:
                throw new Error(`Tipo de recurso no válido: ${nombre}`);
        }
    }

    
    anyadirRecurso( recurso:TRecurso){
        this.recursos.push(recurso);
    }

}