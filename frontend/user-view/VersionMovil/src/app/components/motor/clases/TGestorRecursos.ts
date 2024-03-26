import { TRecurso } from "./TRecurso";
import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoMaterial } from "./TRecursoMaterial";
import { TRecursoTextura } from "./TRecursoTextura";

export class TGestorRecursos{

    private recursos: TRecurso[] = [];

    async getRecurso( nombre:string ){
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
            res = this.crearRecurso(nombre);
            if (res != undefined) {
                try {
                    await res.cargarFichero(nombre); // Esperar a que se cargue el archivo
                    this.anyadirRecurso(res); // Esperar a que se añada el recurso
                } catch (error) {
                    console.error("Error al cargar el recurso:", error);
                }
            }
        }

        return res;
    }

    crearRecurso(nombre: string): TRecurso {
        console.log("creando recurso")
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
    
    async anyadirRecurso( recurso:TRecurso){
        console.log("añadir")
        this.recursos.push(recurso);
    }

}