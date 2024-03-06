
export abstract class TRecurso {

    private nombre:string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    abstract cargarFichero(nombre: string): void;
    abstract draw(): void;


    getNombre(): string{
        return this.nombre;
    }

    setNombre( nombre:string ){
        this.nombre = nombre;
    }

}