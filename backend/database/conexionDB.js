const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.BD, process.env.USERBD || 'root', process.env.PWDBD, {
    host: process.env.HOSTBD || '127.0.0.1',
    dialect: 'mysql', // You can change it based on your database
    port: process.env.PORTBD,
});

module.exports = sequelize;
