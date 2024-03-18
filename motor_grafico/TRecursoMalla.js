"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRecursoMalla = void 0;
var TRecurso_1 = require("./TRecurso");
var Malla_1 = require("./Malla");
var fs = require("fs-js");
var TRecursoMalla = /** @class */ (function (_super) {
    __extends(TRecursoMalla, _super);
    function TRecursoMalla(nombre) {
        var _this = _super.call(this, nombre) || this;
        _this.mallas = [];
        return _this;
    }
    TRecursoMalla.prototype.cargarFichero = function (nombreFichero) {
        //Formato JSON --> JSON
        var _this = this;
        //Leer recurso
        //Para cada malla
        //Crear malla nueva
        //Guardar vértices, normales y coordenadas de texturas
        //Guardar texturas y materiales
        //Guardar malla en el array 
        var fileContent = fs.readFileSync(nombreFichero, 'utf8');
        var lines = fileContent.split('\n');
        var nuevaMalla = new Malla_1.Malla(); // Inicializamos una malla nueva fuera del bucle
        lines.forEach(function (line) {
            var parts = line.trim().split(/\s+/);
            var type = parts[0]; // Cambiado a parts[0]
            switch (type) {
                case 'o':
                    if (nuevaMalla.getVertices.length > 0) {
                        _this.mallas.push(nuevaMalla);
                        nuevaMalla = new Malla_1.Malla();
                    }
                    break;
                case 'v':
                    var vertex = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    nuevaMalla.setVertices(vertex);
                    break;
                case 'vt':
                    var textureCoordinate = [parseFloat(parts[1]), parseFloat(parts[2])];
                    nuevaMalla.setCordTex(textureCoordinate);
                    break;
                case 'vn':
                    var normal = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
                    nuevaMalla.setNormales(normal);
                    break;
                case 'f':
                    var vertexIndices = parts.slice(1).map(function (part) { return parseInt(part.split('/')[0]); });
                    nuevaMalla.setIndices(vertexIndices);
                    break;
            }
        });
        this.mallas.push(nuevaMalla);
    };
    TRecursoMalla.prototype.draw = function () {
        for (var i = 0; i < this.mallas.length; i++) {
            this.mallas[i].dibujar();
        }
    };
    return TRecursoMalla;
}(TRecurso_1.TRecurso));
exports.TRecursoMalla = TRecursoMalla;
