const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Enpromocion = sequelize.define('en_promocion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    idPromo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'en_promocion',
    timestamps: false
});

module.exports = { Enpromocion };

