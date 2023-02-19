import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class User extends Model { }

User.init({
  userName: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize, modelName: 'user'
});
