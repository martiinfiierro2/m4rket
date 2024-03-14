"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Malla = void 0;
var Malla = /** @class */ (function () {
    function Malla() {
    }
    //private texturas: Textura[];
    Malla.prototype.dibujar = function () {
    };
    Malla.prototype.setVertices = function (vecVertices) {
        this.vertices = vecVertices;
    };
    Malla.prototype.setNormales = function (vecNormales) {
        this.normales = vecNormales;
    };
    Malla.prototype.setCordTex = function (vecCordTex) {
        this.cordTex = vecCordTex;
    };
    Malla.prototype.setIndices = function (vecIndices) {
        this.indices = vecIndices;
    };
    return Malla;
}());
exports.Malla = Malla;
