import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export class Report extends Model { }

Report.init({
  name_pet: DataTypes.STRING,
  phone_number: DataTypes.INTEGER,
  pet_info: DataTypes.STRING
}, {
  sequelize, modelName: 'report'
});
