//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById, getUserInvoicesByStatus, getUserInvoicesByPage, postUserInvoice, deleteUserInvoiceById, putUserInvoiceById} = require('../middleware/invoice-middleware.js');
const {verifyUserAuthorization} = require('../middleware/authorization-middleware.js');
const {checkParamId, checkParamInteger, checkReqInvoice} = require('../middleware/checking-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

//Validates and sanitizes all parameters and attatches them directly to the req object as the specified property
// invoiceRouter.param('id', checkParamId('invoiceId'));
invoiceRouter.param('pageNumber', checkParamInteger('pageNumber'));
invoiceRouter.param('resultsPerPage', checkParamInteger('resultsPerPage'));

//Gets all invoices associated with an authenticated user
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices, verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets all paid invoices associated with an authenticated user by Id
invoiceRouter.get('/draft', ensureAuthenticated, getUserInvoicesByStatus('draft'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets pending invoices associated with an authenticated user by Id
invoiceRouter.get('/pending', ensureAuthenticated, getUserInvoicesByStatus('pending'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets draft invoices associated with an authenticated user by Id
invoiceRouter.get('/paid', ensureAuthenticated, getUserInvoicesByStatus('paid'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});











//***********************Need testing
//Can the last three all use the same middleware taking an extra arg for the where clause? same for the above three?
//getUserInvoicesByStatus

//Gets all invoices assoicated with an authenticated user by page
//The pageNumber parameter is an integer of which page you would like to request
//The resultsPerPage is an integer for how many results you would like per page
invoiceRouter.get('/all/:pageNumber/:resultsPerPage', ensureAuthenticated, getUserInvoicesByPage, verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({page: req.page, metadata: req.metadata});
});

invoiceRouter.get('/draft/:pageNumber/:resultsPerPage', ensureAuthenticated, getUserInvoicesByPage, verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({page: req.page, metadata: req.metadata});
});

invoiceRouter.get('/pending/:pageNumber/:resultsPerPage', ensureAuthenticated, getUserInvoicesByPage, verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({page: req.page, metadata: req.metadata});
});

invoiceRouter.get('/paid/:pageNumber/:resultsPerPage', ensureAuthenticated, getUserInvoicesByPage, verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({page: req.page, metadata: req.metadata});
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