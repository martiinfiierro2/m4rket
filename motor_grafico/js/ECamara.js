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
exports.ECamara = void 0;
var TEntidad_1 = require("./TEntidad");
var ECamara = /** @class */ (function (_super) {
    __extends(ECamara, _super);
    function ECamara(perspectiva, paralela, cercano, lejano) {
        var _this = _super.call(this) || this;
        _this.esPerspectiva = false;
        _this.esParalela = false;
        _this.esPerspectiva = perspectiva;
        _this.esParalela = paralela;
        _this.izquierda = 0;
        _this.derecha = 0;
        _this.inferior = 0;
        _this.superior = 0;
        _this.cercano = cercano;
        _this.lejano = lejano;
        return _this;
    }
    ECamara.prototype.setPerspectiva = function () {
        this.esPerspectiva = true;
        this.esParalela = false;
    };
    ECamara.prototype.setParalela = function () {
        this.esParalela = true;
        this.esPerspectiva = false;
    };
    ECamara.prototype.setIzquierda = function (izq) {
        this.izquierda = izq;
    };
    ECamara.prototype.setDerecha = function (dcha) {
        this.derecha = dcha;
    };
    ECamara.prototype.setInferior = function (inf) {
        this.inferior = inf;
    };
    ECamara.prototype.setSuperior = function (sup) {
        this.superior = sup;
    };
    ECamara.prototype.setCercanco = function (cerc) {
        this.cercano = cerc;
    };
    ECamara.prototype.setLejano = function (lej) {
        this.lejano = lej;
    };
    ECamara.prototype.dibujar = function (mat) {
    };
    return ECamara;
}(TEntidad_1.TEntidad));
exports.ECamara = ECamara;
