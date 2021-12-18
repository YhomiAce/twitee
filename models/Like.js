const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");

const Like = postgresDb.define(
  "likes",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: new Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    twitId: {
      type: Sequelize.UUID,
      allowNull: false
    }
    
  },
  {
    paranoid: true
  }
);
// Like.sync({force: true})

module.exports = Like;
