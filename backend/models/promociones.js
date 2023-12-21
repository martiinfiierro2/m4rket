const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB');
const { tipopromo } = require('../models/tipoPromo');

const Promocion = sequelize.define('Promocion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
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
    id_tipoPromo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        eferences: {
            model: tipopromo,
            key: 'id',
        },
    },
}, {
    tableName: 'promociones',
    timestamps: false
});

Promocion.belongsTo(tipopromo, { foreignKey: 'id_tipoPromo' });
module.exports = { Promocion };

