import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export class Auth extends Model { }

Auth.init({
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  user_Id: DataTypes.INTEGER,

}, {
  sequelize, modelName: 'Auth'
});
