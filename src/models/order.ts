import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db.js';

interface OrderAttributes {
  order_id: number;
  name: string;
  email: string;
  phoneNumber: string;
  ski_brand: string;
  ski_model: string;
  ski_length: number;
  service: string;
  order_date: Date;
  status: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'order_id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public order_id!: number;
  public name!: string;
  public ski_brand!: string;
  public ski_model!: string;
  public ski_length!: number;
  public email!: string;
  public phoneNumber!: string;
  public service!: string;
  public order_date!: Date;
  public status!: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
}

Order.init({
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ski_brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ski_model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ski_length: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  service: {
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