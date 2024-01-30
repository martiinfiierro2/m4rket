const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexionDB'); // Archivo que contiene la configuración de Sequelize y la conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genero: {
        type: DataTypes.ENUM('Hombre', 'Mujer'),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('usuario', 'admin'),
        allowNull: true,
    }
},{
    tableName: 'usuarios',
    timestamps: false,
});

//Modificamos el JSON por seguridad: quita la contraseña y cambia el valor id
const serializeUsuario = (usuario) => {
    const { pwd, ...rest } = usuario.toJSON();
    rest.uid = rest.id;
    delete rest.id;
    return rest;
};

const serializarListaUsuarios = (usuarios) => {
    return usuarios.map(usuario => serializeUsuario(usuario));
};

module.exports = { Usuario, serializarListaUsuarios, serializeUsuario }