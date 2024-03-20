import { TRecurso } from "./TRecurso";
import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoMaterial } from "./TRecursoMaterial";
import { TRecursoTextura } from "./TRecursoTextura";

export class TGestorRecursos{

    private recursos: TRecurso[] = [];

    getRecurso( nombre:string ){

        let res: TRecurso|undefined;

        if(this.recursos.length > 0){
            for (const recurso of this.recursos) {
                if (recurso.getNombre() === nombre) {
                    res = recurso;
                    break;
                }
            }
        }

        //si no existe se crea
        else if (res == undefined) {
            res = this.crearRecurso(nombre)
            res.cargarFichero(nombre)
            this.anyadirRecurso(res);
        }

        return res;
    }

    crearRecurso(nombre: string): TRecurso {
        return new TRecursoMalla(nombre);
        /*switch (nombre) {
            case "malla":
                return new TRecursoMalla(nombre);
            case "material":
                return new TRecursoMaterial(nombre);
            case "textura":
                return new TRecursoTextura(nombre);
            default:
                throw new Error(`Tipo de recurso no valido: ${nombre}`);
        }*/
    }

    
    anyadirRecurso( recurso:TRecurso){
        this.recursos.push(recurso);
    }

}