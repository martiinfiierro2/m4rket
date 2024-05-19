import * as glMatrix from 'gl-matrix';
import { TEntidad } from "../clases/TEntidad";
import { text } from 'express';

export class TNodo{

    private entidad: any;
    private hijos: TNodo[] = [];
    private padre!: TNodo | null;
    public traslacion: glMatrix.vec3 = glMatrix.vec3.create();
    private rotacion: glMatrix.vec3 = glMatrix.vec3.create();
    private escalado: glMatrix.vec3 = glMatrix.vec3.create();
    private matrizTransf: glMatrix.mat4 = glMatrix.mat4.create();
    private matAcum: glMatrix.mat4 = glMatrix.mat4.create();
    private actualizarMatriz: Boolean = false;
    private dibujar: Boolean = true;

    // Método para agregar un hijo
    async agregarHijo(nodoHijo: TNodo) {
        this.hijos.push(nodoHijo);
        nodoHijo.padre = this;
    }

    // Método para eliminar un hijo
    async eliminarHijo(nodoHijo: TNodo) {
        const nodoBorrar = this.hijos.find(nodo => nodo === nodoHijo);
        if (nodoBorrar) {
            // Encuentra el índice del elemento a eliminar en la matriz
            const index = this.hijos.indexOf(nodoBorrar);
        
            // Elimina el elemento de la matriz
            if (index !== -1) {
                this.hijos.splice(index, 1);
            }
        }
    }

    async recorrer(matrizAcum: any) {
        let matrix!: glMatrix.mat4;
        if (this.actualizarMatriz) {
            matrix = glMatrix.mat4.multiply(this.matrizTransf, matrizAcum, this.matrizTransf);
            this.actualizarMatriz = false;
        }
    
        if (this.getEntidad() != null) {
            this.entidad.dibujar(this.matrizTransf);
            if(this.getEntidad().recursoMalla.nombre == 'pin.obj'){
                console.log(this.entidad);
            }
        }
    
        // Esperar a que todas las llamadas recursivas se completen
        for (let index = 0; index < this.hijos.length; index++) {
            this.hijos[index].recorrer(this.matrizTransf);
        }
    }
    

    calcularMatriz(){
        let matTrasladada = glMatrix.mat4.create();
        let matEscalada= glMatrix.mat4.create();
        
        
        glMatrix.mat4.translate(matTrasladada, matTrasladada ,this.traslacion);
        glMatrix.mat4.scale(matEscalada, matEscalada, this.escalado);
        
        //Matriz de rotación
        let rotMatrixX = glMatrix.mat4.create();
        let rotMatrixY = glMatrix.mat4.create();
        let rotMatrixZ = glMatrix.mat4.create();

        glMatrix.mat4.fromXRotation(rotMatrixX, this.rotacion[0]);
        glMatrix.mat4.fromYRotation(rotMatrixY, this.rotacion[1]);
        glMatrix.mat4.fromZRotation(rotMatrixZ, this.rotacion[2]);

        // Calcular la matriz de rotación combinada
        let combinedRotMatrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(combinedRotMatrix, rotMatrixZ, rotMatrixY);
        glMatrix.mat4.multiply(combinedRotMatrix, combinedRotMatrix, rotMatrixX);
        
        //Combinar las 3 matrices de transformación
        let transformMatrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(transformMatrix, matTrasladada, matEscalada); // Multiplica la traslación y la escala primero
        glMatrix.mat4.multiply(transformMatrix, transformMatrix, combinedRotMatrix); // Luego multiplica por la rotación

        return transformMatrix;
    }

    // Método para realizar una transformación de traslación
    trasladar( valoresTrasladar: glMatrix.vec3) {
        this.traslacion[0] += valoresTrasladar[0];
        this.traslacion[1] += valoresTrasladar[1];
        this.traslacion[2] += valoresTrasladar[2];

        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, this.traslacion);
        this.actualizarMatriz = true;
    }

    // Método para realizar una transformación de rotación
    rotar( valoresRotar: glMatrix.vec3) {
        this.rotacion[0] += valoresRotar[0];
        this.rotacion[1] += valoresRotar[1];
        this.rotacion[2] += valoresRotar[2];
        
        glMatrix.mat4.rotateX(this.matrizTransf, this.matrizTransf, this.rotacion[0]);
        glMatrix.mat4.rotateY(this.matrizTransf, this.matrizTransf, this.rotacion[1]);
        glMatrix.mat4.rotateZ(this.matrizTransf, this.matrizTransf, this.rotacion[2]);
        console.log(this.rotacion);
        this.actualizarMatriz = true;
    }

    // Método para realizar una transformación de escalado
    escalar( valoresEscalado: glMatrix.vec3) {
        this.escalado[0] *= valoresEscalado[0];
        this.escalado[1] *= valoresEscalado[1];
        this.escalado[2] *= valoresEscalado[2];
        
        glMatrix.mat4.scale(this.matrizTransf, this.matrizTransf, this.escalado);
        this.actualizarMatriz = true;
    }


    //Métodos SET
    async setTraslacion (valoresTrasladar: glMatrix.vec3){
        this.traslacion[0] = valoresTrasladar[0];
        this.traslacion[1] = valoresTrasladar[1];
        this.traslacion[2] = valoresTrasladar[2];

        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, this.traslacion);
        this.actualizarMatriz = true;
    }

    async setRotacion (valoresRotar: glMatrix.vec3){
        this.rotacion[0] = valoresRotar[0];
        this.rotacion[1] = valoresRotar[1];
        this.rotacion[2] = valoresRotar[2];
        
        glMatrix.mat4.rotateX(this.matrizTransf, this.matrizTransf, this.rotacion[0]);
        glMatrix.mat4.rotateY(this.matrizTransf, this.matrizTransf, this.rotacion[1]);
        glMatrix.mat4.rotateZ(this.matrizTransf, this.matrizTransf, this.rotacion[2]);
        this.actualizarMatriz = true;
    }

    async setEscalado (valoresEscalar: glMatrix.vec3){
        this.escalado[0] = valoresEscalar[0];
        this.escalado[1] = valoresEscalar[1];
        this.escalado[2] = valoresEscalar[2];
        
        glMatrix.mat4.scale(this.matrizTransf, this.matrizTransf, this.escalado);
        this.actualizarMatriz = true;
    }

    async setMatrizTransf(valorMatrizTransf: glMatrix.mat4){
        this.matrizTransf = valorMatrizTransf;
        this.actualizarMatriz = true;
    }

    async setEntidad( entidadAnyadir: any ){
        this.entidad = entidadAnyadir;
    }

    async setDibujar (dibujar: boolean){
        this.dibujar = dibujar;
    }

    //Métodos GET
    getTraslacion(){
        return this.traslacion;
    }

    getRotacion(){
        return this.rotacion;
    }

    getEscalado(){
        return this.escalado;
    }

    getDibujar(){
        return this.dibujar;
    }

    getMatrizTransf(){
        return this.matrizTransf;
    }

    getEntidad(){
        return this.entidad;
    }

    getPadre(){
        return this.padre;
    }

}
