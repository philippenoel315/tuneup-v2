import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db.js';

interface OrderAttributes {
  order_id: number;
  user_name: string;
  ski_name: string;
  order_date: Date;
  status: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'order_id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public order_id!: number;
  public user_name!: string;
  public ski_name!: string;
  public order_date!: Date;
  public status!: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
}

Order.init({
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
  sequelize,
  modelName: 'Order'
});

export default Order;