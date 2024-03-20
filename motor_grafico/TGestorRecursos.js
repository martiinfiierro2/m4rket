"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TGestorRecursos = void 0;
var TRecursoMalla_1 = require("./TRecursoMalla");
var TGestorRecursos = /** @class */ (function () {
    function TGestorRecursos() {
        this.recursos = [];
    }
    TGestorRecursos.prototype.getRecurso = function (nombre) {
        var res;
        if (this.recursos.length > 0) {
            for (var _i = 0, _a = this.recursos; _i < _a.length; _i++) {
                var recurso = _a[_i];
                if (recurso.getNombre() === nombre) {
                    res = recurso;
                    break;
                }
            }
        }
        //si no existe se crea
        else if (res == undefined) {
            res = this.crearRecurso(nombre);
            res.cargarFichero(nombre);
            this.anyadirRecurso(res);
        }
        return res;
    };
    TGestorRecursos.prototype.crearRecurso = function (nombre) {
        return new TRecursoMalla_1.TRecursoMalla(nombre);
        /*switch (nombre) {
            case "malla":
                return new TRecursoMalla(nombre);
            case "material":
                return new TRecursoMaterial(nombre);
            case "textura":
                return new TRecursoTextura(nombre);
            default:
                throw new Error(`Tipo de recurso no valido: ${nombre}`);
        }*/
    };
    TGestorRecursos.prototype.anyadirRecurso = function (recurso) {
        this.recursos.push(recurso);
        console.log(this.recursos);
    };
    return TGestorRecursos;
}());
exports.TGestorRecursos = TGestorRecursos;
