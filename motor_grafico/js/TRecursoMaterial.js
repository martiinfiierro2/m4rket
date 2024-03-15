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
exports.TRecursoMaterial = void 0;
var TRecurso_1 = require("./TRecurso");
var TRecursoMaterial = /** @class */ (function (_super) {
    __extends(TRecursoMaterial, _super);
    function TRecursoMaterial(nombre) {
        return _super.call(this, nombre) || this;
    }
    TRecursoMaterial.prototype.cargarFichero = function (nombre) {
        //Formato MTL --> JSON
    };
    TRecursoMaterial.prototype.draw = function () {
    };
    return TRecursoMaterial;
}(TRecurso_1.TRecurso));
exports.TRecursoMaterial = TRecursoMaterial;
