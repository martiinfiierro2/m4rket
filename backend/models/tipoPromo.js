const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const tipopromo = sequelize.define('tipopromo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modificador: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    tableName: 'tipo_promocion',
    timestamps: false
});

module.exports = { tipopromo };

