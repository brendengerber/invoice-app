//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/auth-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

invoiceRouter.get('/', ensureAuthenticated)


module.exports = invoiceRouter;