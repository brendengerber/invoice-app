//Imports necessary modules
require('dotenv').config();
const { Sequelize } = require('sequelize');

//Creates the connected/instantiated Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL);

//Creates the db object
const db = {}
//Attatches the Sequelize library to the db object for easy access and to eliminate repeating imports
db.Sequelize = Sequelize;
//Attatches the connected/instantiated Sequelize instance to the db object 
db.sequelize = sequelize;

module.exports = db


