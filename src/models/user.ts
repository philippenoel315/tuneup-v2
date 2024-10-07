import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db.js';

interface UserAttributes {
  id: number;
  email: string;
  prenom?: string;
  nom?: string;
  adresse?: string;
  zip?: string;
  skis?: number;
  club?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public prenom?: string;
  public nom?: string;
  public adresse?: string;
  public zip?: string;
  public skis?: number;
  public club?: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
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
    type: DataTypes.STRING(20),
  },
  skis: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ski',
      key: 'id'
    }
  },
  club: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: false
});

export default User;