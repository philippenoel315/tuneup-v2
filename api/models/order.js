const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false

  },
  ski_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('En attente', 'En cours', 'Completé', 'Annulé'),
    defaultValue: 'En attente'
  }
}, {
});

module.exports = Order;