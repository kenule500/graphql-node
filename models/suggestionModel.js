import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
  const Suggestion = sequelize.define("Suggestion", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
    },
  });

  return Suggestion;
};
