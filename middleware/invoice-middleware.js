const db = require('../models/index.js');
const {unwrapQueryResults} = require('../utilities/database-utilities.js');

function getUserInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id
        },
        include: "invoiceItems"
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
        include: "invoiceItems"
    }).then(results => {
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoice = results;
        next();
    }).catch(err => {
        next(err);
    })
}

module.exports = {
    getUserInvoices,
    getUserInvoiceById
};