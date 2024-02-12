const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Listacompra = sequelize.define('estadisticas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    idProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idUsu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'estadisticas',
    timestamps: false
});

module.exports = { Estadisticas };

