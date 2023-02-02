import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export class User extends Model { }

User.init({
  userName: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,modelName: 'user'
});
