//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById} = require('../middleware/invoice-middleware.js')

//Creates the router
const invoiceRouter = express.Router();

//Gets all invoices associated with an authenticated User
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices, (req, res, next) => {

})

//Gets an invoice associated with an authenticated User by Id
invoiceRouter.get('/:id', ensureAuthenticated, getUserInvoices, (req, res, next) => {

})


module.exports = invoiceRouter;