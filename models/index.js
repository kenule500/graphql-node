import { Sequelize } from "sequelize";
import userModel from "./userModel.js";
import boardModel from "./boardModel.js";
import suggestionModel from "./suggestionModel.js";

const sequelize = new Sequelize("graphqlDB", "postgres", "starboy50", {
  host: "localhost",
  dialect: "postgres",
});

const User = userModel(sequelize);
const Board = boardModel(sequelize);
const Suggestion = suggestionModel(sequelize);

const db = {
  User,
  Board,
  Suggestion,
  sequelize,
  Sequelize,
};

// Sync all models with database
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("All models synced");
  })
  .catch((err) => {
    console.error("Error syncing models", err);
  });

export default db;
