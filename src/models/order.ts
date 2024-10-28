import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/db.js';
import { OrderAttributes, OrderCreationAttributes } from '../types/types.js';

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public name!: string;
  public ski_brand!: string;
  public ski_model!: string;
  public ski_length!: number;
  public address!: string;
  public email!: string;
  public phoneNumber!: string;
  public service!: string[];
  public notes!: string;
  public status!: 'En attente' | 'En cours' | 'Completé' | 'Annulé';
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  address: {
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },  
  notes: {
    type: DataTypes.STRING,
    allowNull: true
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
