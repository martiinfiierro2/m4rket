import { TRecurso } from "./TRecurso";
import { TRecursoMalla } from "./TRecursoMalla";
import { TRecursoMaterial } from "./TRecursoMaterial";
import { TRecursoTextura } from "./TRecursoTextura";
import { TRecursoShader } from "./TRecrusoShader";

export class TGestorRecursos{

    private recursos: TRecurso[] = [];

    async getRecursoAPI( nombre: string, tipo: string ){
        let res!: TRecurso;
        let contador = 0;

        for (const recurso of this.recursos) {
            if (recurso.getNombre() === nombre && tipo != "malla") {
                res = recurso;
                contador += 1;
            }
        }
        if(contador === 0){
            if (res == undefined) {
                res = this.crearRecurso(nombre, tipo);
                if (res != undefined) {
                    try {
                        await res.cargarFicheroAPI(nombre);
                        this.anyadirRecurso(res); // Esperar a que se añada el recurso
                    } catch (error) {
                        console.error("Error al cargar el recurso:", error);
                    }
                }
            }
        }
        
        return res;
    }

    async borrarRecursos(malla: string, textura: string){
        let indiceEliminar = -1;
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() === malla) {
                indiceEliminar = i;
                break;
            }
        }

        if (indiceEliminar !== -1) {
            this.recursos.splice(indiceEliminar, 1);
        }

        let indiceEliminar2 = -1;
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() === textura) {
                indiceEliminar2 = i;
                break;
            }
        }

        if (indiceEliminar2 !== -1) {
            this.recursos.splice(indiceEliminar2, 1);
        }
    }

    async getRecurso( nombre: string, tipo: string ){
        let res!: TRecurso;
        let contador = 0;

        for (const recurso of this.recursos) {
            if (recurso.getNombre() === nombre && tipo != "malla") {
                res = recurso;
                contador += 1;
            }
        }
        if(contador === 0){
            if (res == undefined) {
                res = this.crearRecurso(nombre, tipo);
                if (res != undefined) {
                    try {
                        await res.cargarFichero(nombre);
                        this.anyadirRecurso(res); // Esperar a que se añada el recurso
                    } catch (error) {
                        console.error("Error al cargar el recurso:", error);
                    }
                }
            }
        }
        
        return res;
    }

    crearRecurso(nombre: string, tipo: string): TRecurso {
        switch (tipo) {
            case "malla":
                return new TRecursoMalla(nombre);
            case "material":
                return new TRecursoMaterial(nombre);
            case "textura":
                return new TRecursoTextura(nombre);
            case "shader":
                return new TRecursoShader(nombre);
            default:
                throw new Error(`Tipo de recurso no valido: ${nombre}`);
        }
    }
    
    async anyadirRecurso( recurso:TRecurso){
        this.recursos.push(recurso);
    }

}