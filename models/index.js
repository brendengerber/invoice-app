'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require('../config/database.js')

//Creates the db object
const db = {}
//Attatches the Sequelize library to the db object for easy access and to eliminate repeating imports
db.Sequelize = Sequelize;
//Attatches the connected/instantiated Sequelize instance to the db object 
db.sequelize = sequelize;

//Loops through the db model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  //Passes in the proper args, creates the models from the files, and attachs them to the db object
  .forEach(file => {
    const model = require(path.join(__dirname, file))(db.sequelize, db.Sequelize, db.Sequelize.DataTypes)
    db[model.name] = model;
  });
//Loops through the models and adds any associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Parses numeric column into numbers instead of strings (note not safe/percise for very long decimals)
db.Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };

module.exports = db;
