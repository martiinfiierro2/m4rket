const { DataTypes } = require('sequelize');
const { Enubicacion } = require('./Enubicacion');
const { Enpromocion } = require('./Enpromocion');
const { Ubicacion } = require('./ubicaciones');
const { Promocion } = require('./promociones');
const sequelize = require('../database/conexionDB'); // Archivo que contiene la configuración de Sequelize y la conexión a la base de datos

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor_energetico: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    grasas: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    grasas_saturadas: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    hidratos_carbono: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    azucares: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fibra: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    proteina: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    sal: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    precio_kg: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ingredientes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
},{
    tableName: 'productos',
    timestamps: false,
});

//Relacion Producto-Promoción
Producto.belongsToMany(Promocion, { through: Enpromocion, foreignKey: 'idProd' });
Promocion.belongsToMany(Producto, { through: Enpromocion, foreignKey: 'idPromo' });

//Relacion Producto-Ubicación
Producto.belongsToMany(Ubicacion, { through: Enubicacion, foreignKey: 'idProd' });
Ubicacion.belongsToMany(Producto, { through: Enubicacion, foreignKey: 'idUbi' });
module.exports = { Producto }