//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById, getUserDraftInvoices, getUserPendingInvoices, getUserPaidInvoices, postUserInvoice, deleteUserInvoiceById, putUserInvoiceById} = require('../middleware/invoice-middleware.js');
const {verifyUserAuthorization} = require('../middleware/authorization-middleware.js');
const {checkParamId, checkReqInvoice} = require('../middleware/checking-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

//Validates and sanitizes all id parameters and attatches them directly to the req object
invoiceRouter.param('id', checkParamId('invoiceId'));

//Gets all invoices associated with an authenticated user
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices, verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});








//Gets all paid invoices associated with an authenticated user by Id
invoiceRouter.get('/draft', ensureAuthenticated, getUserDraftInvoices, verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets all pending invoices associated with an authenticated user by Id
invoiceRouter.get('/pending', ensureAuthenticated, getUserPendingInvoices, verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets all draft invoices associated with an authenticated user by Id
invoiceRouter.get('/paid', ensureAuthenticated, getUserPaidInvoices, verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});










//Gets an invoice associated with an authenticated user by Id
invoiceRouter.get('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), (req, res, next) => {
    res.status(200).send(req.invoice);
});

//Posts an invoice associated with an authenticated user by Id
invoiceRouter.post('/', ensureAuthenticated, checkReqInvoice, postUserInvoice, (req, res, next) => {
    res.status(201).send(req.newInvoice);
});

//make sure checkReqInvoice is accessing the req.updatedInvoice, somehow attatch req.original invoice?
invoiceRouter.put('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), checkReqInvoice, putUserInvoiceById, (req, res, next) => {
    res.status(201).send();
});

invoiceRouter.delete('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), deleteUserInvoiceById, (req, res, next) => {
    res.status(200).send();
})











module.exports = invoiceRouter;