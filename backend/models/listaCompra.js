const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');

const Listacompra = sequelize.define('lista_compra', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    idUsu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'lista_compra',
    timestamps: false
});

module.exports = { Listacompra };

