require('dotenv').config();
const { Sequelize } = require('sequelize');

//Creates amd exports the connected/instantiated Sequelize instance
//Additional configuration can be done here to specify different databases for development, testing, and production using the NODE_ENV variable if desired
module.exports = new Sequelize(process.env.DATABASE_URL);

