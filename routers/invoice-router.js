//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById} = require('../middleware/invoice-middleware.js');
const {authorizeUser} = require('../middleware/authorization-middleware.js');
const {checkParamId} = require('../middleware/checking-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

//Validates and sanitizes all id parameters
invoiceRouter.param('id', checkParamId('invoiceId'));

//Gets all invoices associated with an authenticated User
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices, authorizeUser(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
})

//Gets an invoice associated with an authenticated User by Id
invoiceRouter.get('/:id', ensureAuthenticated, getUserInvoiceById, authorizeUser(['owner', 'admin'], 'invoice'), (req, res, next) => {
    res.status(200).send(req.invoice);
})


module.exports = invoiceRouter;