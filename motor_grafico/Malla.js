"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Malla = void 0;
var Malla = /** @class */ (function () {
    function Malla() {
        this.vertices = [];
        this.normales = [];
        this.cordTex = [];
        this.indices = [];
    }
    //private texturas: Textura[];
    Malla.prototype.dibujar = function () {
    };
    Malla.prototype.setVertices = function (vecVertices) {
        console.log(vecVertices);
        this.vertices.push(vecVertices);
    };
    Malla.prototype.setNormales = function (vecNormales) {
        this.normales.push(vecNormales);
    };
    Malla.prototype.setCordTex = function (vecCordTex) {
        this.cordTex.push(vecCordTex);
    };
    Malla.prototype.setIndices = function (vecIndices) {
        this.indices.push(vecIndices);
    };
    Malla.prototype.getVertices = function () {
        return this.vertices;
    };
    return Malla;
}());
exports.Malla = Malla;
