const db = require('../models/index.js');
const {unwrapQueryResults} = require('../utilities/database-utilities.js');
const {addUserIdToInvoice} = require('../services/database-services.js');

function getUserInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id
        },
        include: [{
            model: db.invoiceItem,
        }]
    }).then(results => {
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoices = results;
        next();
    }).catch(err => {
        next(err);
    });
} 

function getUserInvoiceById(req, res, next){
    db.invoice.findOne({
        where: {
            userId: req.user.id,
            id: req.invoiceId
        },
        include: [{
            model: db.invoiceItem
        }]
    }).then(results => {
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoice = results;
        next();
    }).catch(err => {
        next(err);
    })
}

function postUserInvoice(req, res, next){
    //Adds the user id to the appropriate columns before submitting the query
    let newInvoiceWithUserId = addUserIdToInvoice(req.newInvoice, req.user.id);

    db.invoice.create(
        newInvoiceWithUserId, 
        {include:[db.invoiceItem]}
    ).then(results => {
        return unwrapQueryResults(results);
    }).then(results => {
        req.updatedInvoice = results;
        next()
    }).catch(err => {
        next(err);
    });
}





function updateUserInvoiceById(req, res, next){


}



//on updated cascade?
//on delete cascade?

module.exports = {
    getUserInvoices,
    getUserInvoiceById,
    postUserInvoice,
    updateUserInvoiceById
};