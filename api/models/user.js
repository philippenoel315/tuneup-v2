const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true, // Validates email format
        }
    },
    prenom: {
        type: DataTypes.STRING,
    },
    nom: {
        type: DataTypes.STRING,
    },
    adresse: {
        type: DataTypes.STRING,
    },
    zip: {
        type: DataTypes.STRING(20), // Set a maximum length of 20 characters
    },
    skis: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ski', // Name of the referenced table
            key: 'id'
        }
    },
    club: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'users', // Specify the table name
    timestamps: false // Disable timestamps if not needed
});

module.exports = User;
