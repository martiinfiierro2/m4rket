"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRecurso = void 0;
var TRecurso = /** @class */ (function () {
    function TRecurso(nombre) {
        this.nombre = nombre;
    }
    TRecurso.prototype.getNombre = function () {
        return this.nombre;
    };
    TRecurso.prototype.setNombre = function (nombre) {
        this.nombre = nombre;
    };
    return TRecurso;
}());
exports.TRecurso = TRecurso;
