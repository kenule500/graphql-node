import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
  const Board = sequelize.define("Board", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
  Board.associate = (models) => {
    Board.hasMany(models.Suggestion, {
      foreignKey: "boardId",
    });
  };

  return Board;
};
