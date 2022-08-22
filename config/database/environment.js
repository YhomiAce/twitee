const dotenv = require("dotenv").config();
module.exports = {
  development: {
    host: process.env.LOCAL_HOSTNAME,
    database: process.env.LOCAL_DB_NAME,
    username: process.env.LOCAL_USERNAME,
    password: process.env.LOCAL_PASSWORD,
    port: process.env.LOCAL_PORT,
    dialect: process.env.DIALECT,
    secret: process.env.SECRET,
    seederStorage: process.env.SEEDER_STORAGE,
  },
  production: {
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    dialect: process.env.DIALECT,
    secret: process.env.SECRET,
    seederStorage: process.env.SEEDER_STORAGE,
  },
};

