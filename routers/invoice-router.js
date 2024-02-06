//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById, postUserInvoice, updateUserInvoiceById} = require('../middleware/invoice-middleware.js');
const {authorizeUser} = require('../middleware/authorization-middleware.js');
const {checkParamId, checkReqInvoice} = require('../middleware/checking-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

//Validates and sanitizes all id parameters and attatches them directly to the req object
invoiceRouter.param('id', checkParamId('invoiceId'));

//Gets all invoices associated with an authenticated user
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices, authorizeUser(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
})

//Gets an invoice associated with an authenticated user by Id
invoiceRouter.get('/:id', ensureAuthenticated, getUserInvoiceById, authorizeUser(['owner', 'admin'], 'invoice'), (req, res, next) => {
    res.status(200).send();
})




//******** any way to avoid sending userId with the items? */
//*some how include it with association, grabbing the primary of the one it's associated to?
//Posts an invoice associated with an authenticated user by Id
invoiceRouter.post('/', ensureAuthenticated, checkReqInvoice, postUserInvoice, (req, res, next) => {
    res.status(200).send(req.newInvoice);
})












//Updates an invoice associated with an authenticated user by Id
invoiceRouter.put('/:id', ensureAuthenticated, checkReqInvoice, getUserInvoiceById, authorizeUser(['owner', 'admin'], 'invoice'), updateUserInvoiceById, (req, res, next) => {
    res.status(200).send(req.invoice);
})

module.exports = invoiceRouter;