"use strict";
import db from "../models/index.js";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = db;
    // add migration commands here, for example:
    await sequelize.query("ALTER TABLE `Users` ADD COLUMN `name` VARCHAR(255)");
  },

  async down(queryInterface, Sequelize) {
    const { sequelize } = db;
    // add rollback commands here, for example:
    await sequelize.query("ALTER TABLE `Users` DROP COLUMN `username`");
  },
};
