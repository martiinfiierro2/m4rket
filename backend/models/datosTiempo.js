const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const DatosTiempo = sequelize.define('datos_tiempo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_ini: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    idLista: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    idUsu: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'datos_tiempo',
    timestamps: false
});

module.exports = { DatosTiempo };

