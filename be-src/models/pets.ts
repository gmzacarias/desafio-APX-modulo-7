import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/sequelize'

export class Pet extends Model { }

Pet.init({
  name: DataTypes.STRING,
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
  image_URL: DataTypes.STRING,
  found: DataTypes.BOOLEAN,
  zone: DataTypes.STRING,
  userId: DataTypes.INTEGER,
}, {
  sequelize, modelName: 'pet'
});
