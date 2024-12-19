const Sequelize = require('sequelize');
const mysql2 = require('mysql2');
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 3,
      min: 0
    }
  }
);
sequelize.close()
  .then(() => console.log('Connection closed successfully'))
  .catch(err => console.error('Error while closing connection:', err));

module.exports = sequelize;