"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TNodo = void 0;
var glMatrix = require("gl-matrix");
var TNodo = /** @class */ (function () {
    function TNodo() {
        this.hijos = [];
        this.traslacion = glMatrix.vec3.create();
        this.rotacion = glMatrix.vec3.create();
        this.escalado = glMatrix.vec3.create();
        this.matrizTransf = glMatrix.mat4.create();
        this.actualizarMatriz = false; //para saber si hay alguna modificación en las transformaciones
    }
    // Método para agregar un hijo
    TNodo.prototype.agregarHijo = function (nodoHijo) {
        this.hijos.push(nodoHijo);
        nodoHijo.padre = this;
    };
    // Método para eliminar un hijo
    TNodo.prototype.eliminarHijo = function (nodoHijo) {
        var index = this.hijos.indexOf(nodoHijo);
        if (index > -1) {
            this.hijos.splice(index, 1);
            nodoHijo.padre = null;
        }
    };
    TNodo.prototype.recorrer = function (matrizAcum) {
        if (this.actualizarMatriz) {
            glMatrix.mat4.multiply(this.matrizTransf, matrizAcum, this.matrizTransf);
            this.actualizarMatriz = false;
        }
        //this.entidad.dibujar(this.matrizTransf, this.actualizarMatriz);
        for (var index = 0; index < this.hijos.length; index++) {
            this.hijos[index].recorrer(this.matrizTransf);
            console.log("soy hijo " + index);
        }
    };
    TNodo.prototype.calcularMatriz = function () {
        var matTrasladada = glMatrix.mat4.create();
        var matEscalada = glMatrix.mat4.create();
        glMatrix.mat4.translate(matTrasladada, matTrasladada, this.traslacion);
        glMatrix.mat4.scale(matEscalada, matEscalada, this.escalado);
        //Matriz de rotación
        var rotMatrixX = glMatrix.mat4.create();
        var rotMatrixY = glMatrix.mat4.create();
        var rotMatrixZ = glMatrix.mat4.create();
        glMatrix.mat4.fromXRotation(rotMatrixX, this.rotacion[0]);
        glMatrix.mat4.fromYRotation(rotMatrixY, this.rotacion[1]);
        glMatrix.mat4.fromZRotation(rotMatrixZ, this.rotacion[2]);
        // Calcular la matriz de rotación combinada
        var combinedRotMatrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(combinedRotMatrix, rotMatrixZ, rotMatrixY);
        glMatrix.mat4.multiply(combinedRotMatrix, combinedRotMatrix, rotMatrixX);
        //Combinar las 3 matrices de transformación
        var transformMatrix = glMatrix.mat4.create();
        glMatrix.mat4.multiply(transformMatrix, matTrasladada, matEscalada); // Multiplica la traslación y la escala primero
        glMatrix.mat4.multiply(transformMatrix, transformMatrix, combinedRotMatrix); // Luego multiplica por la rotación
        return transformMatrix;
    };
    // Método para realizar una transformación de traslación
    TNodo.prototype.trasladar = function (valoresTrasladar) {
        this.traslacion[0] += valoresTrasladar[0];
        this.traslacion[1] += valoresTrasladar[1];
        this.traslacion[2] += valoresTrasladar[2];
        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, this.traslacion);
        this.actualizarMatriz = true;
    };
    // Método para realizar una transformación de rotación
    TNodo.prototype.rotar = function (valoresRotar) {
        this.rotacion[0] += valoresRotar[0];
        this.rotacion[1] += valoresRotar[1];
        this.rotacion[2] += valoresRotar[2];
        glMatrix.mat4.rotateX(this.matrizTransf, this.matrizTransf, this.rotacion[0]);
        glMatrix.mat4.rotateY(this.matrizTransf, this.matrizTransf, this.rotacion[1]);
        glMatrix.mat4.rotateZ(this.matrizTransf, this.matrizTransf, this.rotacion[2]);
        this.actualizarMatriz = true;
    };
    // Método para realizar una transformación de escalado
    TNodo.prototype.escalar = function (valoresEscalado) {
        this.escalado[0] *= valoresEscalado[0];
        this.escalado[1] *= valoresEscalado[1];
        this.escalado[2] *= valoresEscalado[2];
        glMatrix.mat4.scale(this.matrizTransf, this.matrizTransf, this.escalado);
        this.actualizarMatriz = true;
    };
    //Métodos SET
    TNodo.prototype.setTraslacion = function (valoresTrasladar) {
        this.traslacion[0] = valoresTrasladar[0];
        this.traslacion[1] = valoresTrasladar[1];
        this.traslacion[2] = valoresTrasladar[2];
        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, this.traslacion);
        this.actualizarMatriz = true;
    };
    TNodo.prototype.setRotacion = function (valoresRotar) {
        this.rotacion[0] = valoresRotar[0];
        this.rotacion[1] = valoresRotar[1];
        this.rotacion[2] = valoresRotar[2];
        glMatrix.mat4.rotateX(this.matrizTransf, this.matrizTransf, this.rotacion[0]);
        glMatrix.mat4.rotateY(this.matrizTransf, this.matrizTransf, this.rotacion[1]);
        glMatrix.mat4.rotateZ(this.matrizTransf, this.matrizTransf, this.rotacion[2]);
        this.actualizarMatriz = true;
    };
    TNodo.prototype.setEscalado = function (valoresEscalar) {
        this.escalado[0] = valoresEscalar[0];
        this.escalado[1] = valoresEscalar[1];
        this.escalado[2] = valoresEscalar[2];
        glMatrix.mat4.scale(this.matrizTransf, this.matrizTransf, this.escalado);
        this.actualizarMatriz = true;
    };
    TNodo.prototype.setMatrizTransf = function (valorMatrizTransf) {
        this.matrizTransf = valorMatrizTransf;
        this.actualizarMatriz = true;
    };
    TNodo.prototype.setEntidad = function (entidadAnyadir) {
        this.entidad = entidadAnyadir;
    };
    //Métodos GET
    TNodo.prototype.getTraslacion = function () {
        return this.traslacion;
    };
    TNodo.prototype.getRotacion = function () {
        return this.rotacion;
    };
    TNodo.prototype.getEscalado = function () {
        return this.escalado;
    };
    TNodo.prototype.getMatrizTransf = function () {
        return this.matrizTransf;
    };
    TNodo.prototype.getEntidad = function () {
        return this.entidad;
    };
    TNodo.prototype.getPadre = function () {
        return this.padre;
    };
    return TNodo;
}());
exports.TNodo = TNodo;
