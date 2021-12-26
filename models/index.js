const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  operatorsAliases: 0
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.contacts = require("./contact")(sequelize, Sequelize);
db.tickets = require("./ticket")(sequelize, Sequelize);

module.exports = db;