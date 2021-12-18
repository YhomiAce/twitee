const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");

const Comment = postgresDb.define(
  "comments",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: new Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    twitId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false
    }
    
  },
  {
    paranoid: true
  }
);
// Comment.sync({force: true});


module.exports = Comment;
