//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments, attatching results to the req object, and handling any errors before passing them up to the error handling middleware with next(err)

//Validation functions will add validated req bodies and parameters as custom properties to the req object
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted
//Original invoices will be attatched to req.invoice at the beginning of routes to be used for checking ownership as well as adding invoiceId to invoice items sent for updating
//Params will be attatched to the req object as their corresponding property
//Existing invoices will be attatched to req.invoice
//New and updated invoices will be validated and attatched to req.newInvoice
//Any bodies or params that have hence been attatched directly to the req with a custom propertry can be considered validated, sanatized, and safe to use

//Middleware flow should be as follows: 
//Ensure authentication 
//Validate user input (and attatch req bodies and params to the proper req properties)
//Retreive resource (this will be used to confirm ownership/authorization, so should be done even on delete routes)
//Verify authorization
//Complete database action

//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');
const {getUserInvoices, getUserInvoiceById, getPaginatedUserInvoices, postUserInvoice, deleteUserInvoiceById, putUserInvoiceById} = require('../middleware/invoice-middleware.js');
const {verifyUserAuthorization} = require('../middleware/authorization-middleware.js');
const {checkParamId, checkParamInteger, checkReqInvoice} = require('../middleware/checking-middleware.js');

//Creates the router
const invoiceRouter = express.Router();

//Validates and sanitizes all parameters and attatches them directly to the req object as the specified property
invoiceRouter.param('id', checkParamId('invoiceId'));
invoiceRouter.param('pageNumber', checkParamInteger('pageNumber'));
invoiceRouter.param('resultsPerPage', checkParamInteger('resultsPerPage'));

//Gets all invoices associated with an authenticated user
invoiceRouter.get('/all', ensureAuthenticated, getUserInvoices(), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets all paid invoices associated with an authenticated user by Id
invoiceRouter.get('/draft', ensureAuthenticated, getUserInvoices('draft'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets pending invoices associated with an authenticated user by Id
invoiceRouter.get('/pending', ensureAuthenticated, getUserInvoices('pending'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets draft invoices associated with an authenticated user by Id
invoiceRouter.get('/paid', ensureAuthenticated, getUserInvoices('paid'), verifyUserAuthorization(['owner', 'admin'], 'invoices'), (req, res, next) => {
    res.status(200).send(req.invoices);
});

//Gets all invoices assoicated with an authenticated user by page
//The pageNumber parameter is an integer of which page you would like to request
//The resultsPerPage is an integer for how many results you would like per page
invoiceRouter.get('/all/:pageNumber/:resultsPerPage', ensureAuthenticated, getPaginatedUserInvoices(), verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({metadata: req.metadata, page: req.page});
});

//Gets all invoices assoicated with an authenticated user by page
//The pageNumber parameter is an integer of which page you would like to request
//The resultsPerPage is an integer for how many results you would like per page
invoiceRouter.get('/draft/:pageNumber/:resultsPerPage', ensureAuthenticated, getPaginatedUserInvoices('draft'), verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({metadata: req.metadata, page: req.page});
});

//Gets all invoices assoicated with an authenticated user by page
//The pageNumber parameter is an integer of which page you would like to request
//The resultsPerPage is an integer for how many results you would like per page
invoiceRouter.get('/pending/:pageNumber/:resultsPerPage', ensureAuthenticated, getPaginatedUserInvoices('pending'), verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({metadata: req.metadata, page: req.page});
});

//Gets all invoices assoicated with an authenticated user by page
//The pageNumber parameter is an integer of which page you would like to request
//The resultsPerPage is an integer for how many results you would like per page
invoiceRouter.get('/paid/:pageNumber/:resultsPerPage', ensureAuthenticated, getPaginatedUserInvoices('paid'), verifyUserAuthorization(['owner', 'admin'], 'page'), (req, res, next) => {
    res.status(200).send({metadata: req.metadata, page: req.page});
});

//Gets an invoice associated with an authenticated user by Id
invoiceRouter.get('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), (req, res, next) => {
    res.status(200).send(req.invoice);
});

//Posts an invoice associated with an authenticated user by Id
invoiceRouter.post('/', ensureAuthenticated, checkReqInvoice, postUserInvoice, (req, res, next) => {
    res.status(201).send(req.newInvoice);
});

//Attatches original invoice first to use for checking ownership and adding invoice id to the incoming update in case it was not included
invoiceRouter.put('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), checkReqInvoice, putUserInvoiceById, (req, res, next) => {
    res.status(201).send();
});

//Attatches original invoice first to use for checking ownership
invoiceRouter.delete('/:id', ensureAuthenticated, getUserInvoiceById, verifyUserAuthorization(['owner', 'admin'], 'invoice'), deleteUserInvoiceById, (req, res, next) => {
    res.status(200).send();
})

module.exports = invoiceRouter;