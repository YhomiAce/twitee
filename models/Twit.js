const Sequelize = require("sequelize");
const postgresDb = require("../config/database/connection");
const Comment = require("./Comment");
const Like = require("./Like");
const User = require("./User");

const Twit = postgresDb.define(
  "twits",
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
    twit: {
      type: Sequelize.TEXT,
      allowNull: false
    }
    
  },
  {
    paranoid: true
  }
);
// Twit.sync({force: true});
// Relationship
Twit.hasMany(Comment, {
  foreignKey: "twitId",
  as: "comments",
  onDelete: "cascade",
  hooks: true
});

Twit.hasMany(Like, {
  foreignKey: "twitId",
  as: "likes",
  onDelete: "cascade",
  hooks: true
});

Twit.belongsTo(User, {
  as: "owner",
  foreignKey: "user_id",
  sourceKey: "user_id"
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

User.hasMany(Twit, {
  foreignKey: "user_id",
  as: "user"
});


module.exports = Twit;
