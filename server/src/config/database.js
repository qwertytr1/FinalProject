const Sequelize = require('sequelize');
const mysql2 = require('mysql2');
require("dotenv").config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false,
  pool: {
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
