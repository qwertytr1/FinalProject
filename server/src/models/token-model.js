const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TokenSchema = sequelize.define("TokenSchema", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        field: 'user_id', // Ensures the column name in the database is 'user_id'
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'refresh_token', // Ensures the column name in the database is 'refresh_token'
    },
});

module.exports = TokenSchema; // Default export
