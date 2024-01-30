const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB'); // Archivo que contiene la configuración de Sequelize y la conexión a la base de datos

const Ubicacion = sequelize.define('Ubicacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    referencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    tableName: 'ubicaciones',
    timestamps: false,
});

module.exports = { Ubicacion }