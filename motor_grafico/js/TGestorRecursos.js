"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TGestorRecursos = void 0;
var TRecursoMalla_1 = require("./TRecursoMalla");
var TRecursoMaterial_1 = require("./TRecursoMaterial");
var TRecursoTextura_1 = require("./TRecursoTextura");
var TGestorRecursos = /** @class */ (function () {
    function TGestorRecursos(parameters) {
    }
    TGestorRecursos.prototype.getRecurso = function (nombre) {
        var res;
        for (var _i = 0, _a = this.recursos; _i < _a.length; _i++) {
            var recurso = _a[_i];
            if (recurso.getNombre() === nombre) {
                res = recurso;
                break;
            }
        }
        //si no existe se crea
        if (res == undefined) {
            res = this.crearRecurso(nombre);
            res.cargarFichero(nombre);
            this.anyadirRecurso(res);
        }
        return res;
    };
    TGestorRecursos.prototype.crearRecurso = function (nombre) {
        switch (nombre) {
            case "malla":
                return new TRecursoMalla_1.TRecursoMalla(nombre);
            case "material":
                return new TRecursoMaterial_1.TRecursoMaterial(nombre);
            case "textura":
                return new TRecursoTextura_1.TRecursoTextura(nombre);
            default:
                throw new Error("Tipo de recurso no v\u00E1lido: ".concat(nombre));
        }
    };
    TGestorRecursos.prototype.anyadirRecurso = function (recurso) {
        this.recursos.push(recurso);
    };
    return TGestorRecursos;
}());
exports.TGestorRecursos = TGestorRecursos;
