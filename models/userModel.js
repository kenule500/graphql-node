import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user", // Set the default value to "user"
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Board, {
      foreignKey: "owner",
    });
    User.hasMany(models.Suggestion, {
      foreignKey: "creatorId",
    });
  };

  return User;
};
