const Sequelize = require("sequelize");
const postgresDb = require("../config/database/connection");

const User = postgresDb.define(
  "users",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: new Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    email_token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isActivated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  },
  {
    paranoid: true
  }
);
// User.sync({force: true})

module.exports = User;
