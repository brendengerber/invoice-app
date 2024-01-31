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

//Loops through the db models and attatches them to the db object
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(db.sequelize, db.Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.user.findAll().then( result => console.log(result))


module.exports = db;
