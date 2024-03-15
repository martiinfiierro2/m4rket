"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMotorTAG = void 0;
var TNodo_1 = require("./TNodo");
var ECamara_1 = require("./ECamara");
var ELuz_1 = require("./ELuz");
var EModelo_1 = require("./EModelo");
var TMotorTAG = /** @class */ (function () {
    function TMotorTAG() {
    }
    TMotorTAG.prototype.crearNodo = function (padre, trasl, rot, esc) {
        var nodoCreado;
        nodoCreado = new TNodo_1.TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        return nodoCreado;
    };
    TMotorTAG.prototype.crearCamara = function (padre, trasl, rot, esc, perspectiva, paralela, cercano, lejano) {
        var nodoCreado, entidadCamara;
        nodoCreado = new TNodo_1.TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        entidadCamara = new ECamara_1.ECamara(perspectiva, paralela, cercano, lejano); //falta añadir los atributos pasados por param.
        nodoCreado.setEntidad(entidadCamara);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        return nodoCreado;
    };
    TMotorTAG.prototype.crearLuz = function (padre, trasl, rot, esc, intensidad, tipoLuz) {
        var nodoCreado, entidadLuz;
        nodoCreado = new TNodo_1.TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        entidadLuz = new ELuz_1.ELuz(); //falta añadir los atributos pasados por param.
        nodoCreado.setEntidad(entidadLuz);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        return nodoCreado;
    };
    TMotorTAG.prototype.crearModelo = function (padre, trasl, rot, esc, nombreFichero) {
        var nodoCreado, recursoMalla, entidadModelo;
        nodoCreado = new TNodo_1.TNodo();
        if (padre == null) {
            padre = this.raiz;
        }
        padre.agregarHijo(nodoCreado);
        recursoMalla = this.gestorRecursos.getRecurso(nombreFichero);
        entidadModelo = new EModelo_1.EModelo(recursoMalla);
        nodoCreado.setEntidad(entidadModelo);
        nodoCreado.setTraslacion(trasl);
        nodoCreado.setRotacion(rot);
        nodoCreado.setEscalado(esc);
        return nodoCreado;
    };
    return TMotorTAG;
}());
exports.TMotorTAG = TMotorTAG;
