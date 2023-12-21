const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Enubicacion = sequelize.define('en_ubicacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    idProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idUbi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha_ini: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'en_ubicacion',
    timestamps: false
});

module.exports = { Enubicacion };

