const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const DatosContadores = sequelize.define('datos_contadores', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idProd: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'datos_contadores',
    timestamps: false
});

module.exports = { DatosContadores };

