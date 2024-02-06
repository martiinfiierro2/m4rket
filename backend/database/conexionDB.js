const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.BD, 'root', process.envPWDBD, {
    host: 'localhost',
    dialect: 'mysql', // You can change it based on your database
    port: process.env.PORTDB,
});

module.exports = sequelize;
