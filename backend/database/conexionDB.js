const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bd_m4rket', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', // You can change it based on your database
});

module.exports = sequelize;