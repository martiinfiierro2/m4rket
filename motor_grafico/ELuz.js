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
exports.ELuz = void 0;
var TEntidad_1 = require("./TEntidad");
var ELuz = /** @class */ (function (_super) {
    __extends(ELuz, _super);
    function ELuz() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ELuz.prototype.dibujar = function (matTransf) {
    };
    //SETTERS
    ELuz.prototype.setIntensidad = function (intesidad) {
        this.intensidad = intesidad;
    };
    ELuz.prototype.setTipoLuz = function (tLuz) {
        this.tipoLuz = tLuz;
    };
    ELuz.prototype.setApertura = function (ap) {
        this.apertura = ap;
    };
    ELuz.prototype.setAtenAngular = function (atAng) {
        this.atenAngular = atAng;
    };
    ELuz.prototype.setAtenCte = function (atCte) {
        this.atenCte = atCte;
    };
    ELuz.prototype.setAtenLineal = function (atLin) {
        this.atenLineal = atLin;
    };
    ELuz.prototype.setAtenCuadrat = function (atCuadr) {
        this.atenCuadrat = atCuadr;
    };
    //GETTERS
    ELuz.prototype.getIntensidad = function () {
        return this.intensidad;
    };
    ELuz.prototype.getTipoLuz = function () {
        return this.tipoLuz;
    };
    ELuz.prototype.getApertura = function () {
        return this.apertura;
    };
    ELuz.prototype.getAtenAngular = function () {
        return this.atenAngular;
    };
    ELuz.prototype.getAtenCte = function () {
        return this.atenCte;
    };
    ELuz.prototype.getAtenLineal = function () {
        return this.atenLineal;
    };
    ELuz.prototype.getAtenCuadrat = function () {
        return this.atenCuadrat;
    };
    return ELuz;
}(TEntidad_1.TEntidad));
exports.ELuz = ELuz;
