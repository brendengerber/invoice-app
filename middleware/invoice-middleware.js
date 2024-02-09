const db = require('../models/index.js');
const {unwrapQueryResults, checkForEmptyResults, addPropertyToDatabaseObject, processQueryError} = require('../utilities/database-utilities.js');
const _ = require('lodash');

function getUserInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id
        },
        include: [{
            model: db.invoiceItem,
        }]
    }).then(results => {
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoices = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    });
}; 

function getUserDraftInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id,
            status: "draft"
        },
        include: [{
            model: db.invoiceItem,
        }]
    }).then(results => {
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoices = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    });
};

function getUserPendingInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id,
            status: "pending"
        },
        include: [{
            model: db.invoiceItem,
        }]
    }).then(results => {
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoices = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    });
};

function getUserPaidInvoices(req, res, next){
    db.invoice.findAll({
        where: {
            userId: req.user.id,
            status: "paid"
        },
        include: [{
            model: db.invoiceItem,
        }]
    }).then(results => {
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoices = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    });
};

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
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.invoice = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    })
};

function postUserInvoice(req, res, next){
    db.invoice.create(
        //Adds the user id to the appropriate columns before submitting the query
        addPropertyToDatabaseObject(req.newInvoice, "userId", req.user.id), {
            include:[{
                model:  db.invoiceItem
            }]
        }
    ).then(results => {
        checkForEmptyResults(results);
        return unwrapQueryResults(results);
    }).then(results => {
        req.newInvoice = results;
        next();
    }).catch(err => {
        next(processQueryError(err));
    });
};

//***********is this adding invoiceId to invoice? i.e. invoice.invoiceId */
//***********function is also not currently adding invoice.id from req.invoice.id */
//*****it does properly add userId to everything though, the others liek invoice.invoiceId don't get added because they are not included in the query, still sloppy tho */
async function putUserInvoiceById(req, res, next){
    let t;
    try{
        //Adds id properties to the newInvoice where appropriate in case they do not already exist from the object sent by the front end
        //Allows invoice objects to be sent from frontend without id properties
        req.newInvoice.id = req.invoice.id;
        req.newInvoice = addPropertyToDatabaseObject(req.newInvoice, "userId", req.user.id);

        //Creates the new transaction where all queries will be added
        t = await db.sequelize.transaction();
        
        //Query to update the invoice (excluding associations)
        db.invoice.update(
            //Adds the user id to the appropriate records before submitting the query
            req.newInvoice, {
                where: {
                    id: req.invoiceId,
                    userId: req.user.id,
                }
            }, {transaction: t}).catch(err => {
                next(processQueryError(err));
            });
        
        //Creates a list of invoiceItem ids submitted with the updated invoice that already exist, (i.e. non new/existing invoiceItems)
        const idsToUpdate = req.newInvoice.invoiceItems
        //Removes invoiceItems that don't have an id property
        .filter(ingredient => ingredient.id)
        //Returns the id for each remaining invoiceItem
        .map(ingredient => ingredient.id)
        //Query to delete any invoiceItems that were present in the original invoice, but not present in the updated invoice
        db.invoiceItem.destroy({
            where: {
                id: {
                    [db.Sequelize.Op.notIn]: idsToUpdate,
                },
                invoiceId: req.invoice.id
            }
        }, {transaction: t}).catch(err => {
            next(processQueryError(err));
        });

        //Loops over the invoiceItems in the new invoice and adds a query to the transaction to either update or create the record
        for(let invoiceItem of req.newInvoice.invoiceItems){
            
            //Adds the invoice id in case it does not already exist from the object sent by the frontend
            invoiceItem.invoiceId = req.invoice.id
            
            //Updates the invoiceItem if it exists, or creates it if it's new
            db.invoiceItem.upsert(
                invoiceItem, {
                    where: {
                        invoiceId: req.invoice.id,
                        userId: req.user.id
                    }
                }, {transaction: t}
            ).catch(err => {
                next(processQueryError(err));
            });
        } 

        //Commits the transaction's queries
        await t.commit();
        next();

    }catch(err){
        //Roles back any queries if the transaction throws an error
        if (t) {
            t.rollback().then(delete t);
        }
        next(processQueryError(err));
    }
};

function deleteUserInvoiceById(req, res, next){
    console.log(req.invoiceId)
    db.invoice.destroy({
        where: {
            userId: req.user.id,
            id: req.invoiceId
        }
    }).then(results => {
        next()
    }).catch(err => {
        console.log(err)
        next(processQueryError(err));
    });
}

module.exports = {
    getUserInvoices,
    getUserInvoiceById,
    getUserDraftInvoices,
    getUserPendingInvoices,
    getUserPaidInvoices,
    postUserInvoice,
    deleteUserInvoiceById,
    putUserInvoiceById
};