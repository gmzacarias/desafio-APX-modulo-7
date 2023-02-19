import { sequelize } from "./lib/sequelize";
import "./models"

sequelize.sync({ alter: true }).then((res) => console.log(res));