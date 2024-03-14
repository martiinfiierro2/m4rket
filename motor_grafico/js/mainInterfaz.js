"use strict";
var glMatrix = require("gl-matrix");
var TMotorTAG_1 = require("./TMotorTAG");
var motor = new TMotorTAG_1.TMotorTAG();
// Crear cámara y luz, como hijas de la raiz
var cam = motor.crearCamara(null, glMatrix.vec3.fromValues(0, 0, 25), glMatrix.vec3.fromValues(0, 7 * Math.PI / 4, 0), glMatrix.vec3.fromValues(1, 1, 1), true, false, 0, 0);
var luz = motor.crearLuz(null, glMatrix.vec3.fromValues(0, 25, 0), glMatrix.vec3.fromValues(3 * Math.PI / 2, 0, 0), glMatrix.vec3.fromValues(1, 1, 1), 1, 'puntual');
// Crear nodo intermedio, y dos nodos hijos con dos mallas
var personaje = motor.crearNodo(null, glMatrix.vec3.fromValues(10, 0, 10), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(1, 1, 1));
var cuerpo = motor.crearModelo(personaje, glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(0, 0, 0), glMatrix.vec3.fromValues(1, 1, 1), 'cuerpo.blend');
var sombrero = motor.crearModelo(personaje, glMatrix.vec3.fromValues(0, 10, 0), glMatrix.vec3.fromValues(0, 0, Math.PI / 8), glMatrix.vec3.fromValues(1, 1, 1), 'sombrero.blend');
personaje.recorrer(0);
//                  RAIZ
//     cam          luz             personaje
//                          cuerpo               sombrero
