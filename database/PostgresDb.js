require("dotenv").config();
const Sequelize = require("sequelize");

class CustomDecimal extends Sequelize.DataTypes.DECIMAL {
  static parse(value) {
    return parseFloat(value);
  }
}

const PostgresDb = new Sequelize(
  process.env.LOCAL_DB_NAME,
  process.env.LOCAL_USERNAME,
  process.env.LOCAL_PASSWORD,
  {
    host: process.env.LOCAL_HOSTNAME,
    dialect: process.env.LOCAL_DB_CONNECTION,
    raw: true,
    port: process.env.LOCAL_PORT,
    seederStorage: 'sequelize',
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 80000
    },
    hooks: {
      afterConnect() {
        const dTypes = {
          DECIMAL: CustomDecimal
        };
        this.connectionManager.refreshTypeParser(dTypes);
      }
    }
  }
);

PostgresDb.authenticate()
  .then(() => {
    console.log("Connection with database has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
module.exports = PostgresDb;
