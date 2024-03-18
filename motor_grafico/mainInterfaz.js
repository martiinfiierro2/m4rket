"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glMatrix = require("gl-matrix");
var TMotorTAG_1 = require("./TMotorTAG");
function main() {
    var motor = new TMotorTAG_1.TMotorTAG();
    // Crear cámara y luz, como hijas de la raiz
    //const cam: TNodo = motor.crearCamara( null, glMatrix.vec3.fromValues(0,0,25), glMatrix.vec3.fromValues(0,7*Math.PI/4,0), glMatrix.vec3.fromValues(1,1,1), true, false, 0, 0); 
    //const luz: TNodo = motor.crearLuz( null, glMatrix.vec3.fromValues(0,25,0), glMatrix.vec3.fromValues(3*Math.PI/2,0,0), glMatrix.vec3.fromValues(1,1,1), 1, 'puntual');
    // Crear nodo intermedio, y dos nodos hijos con dos mallas
    var personaje = motor.crearNodo(null, glMatrix.vec3.fromValues(10, 0, 10), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(1, 1, 1));
    var cuerpo = motor.crearModelo(personaje, glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(1, 1, 1), 'conTextura.obj');
    var sombrero = motor.crearModelo(personaje, glMatrix.vec3.fromValues(0, 10, 0), glMatrix.vec3.fromValues(0, 0, Math.PI / 8), glMatrix.vec3.fromValues(1, 1, 1), 'conTextura.obj');
    console.log('personaje: ' + personaje + ', cuerpo: ' + cuerpo + ', sombrero: ' + sombrero);
    personaje.recorrer(0);
}
main();
//                  RAIZ
//     cam          luz             personaje
//                          cuerpo               sombrero
