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

function getUserDraftInvoicesById(req, res, next){

}

function getUserPublishedInvoicesById(req, res, next){

}


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

async function putUserInvoiceById(req, res, next){
    let t;
    try{
        //Creates the new transaction where all queries will be added
        t = await db.sequelize.transaction();
        
        //Query to update the invoice (excluding associations)
        db.invoice.update(
            //Adds the user id to the appropriate records before submitting the query
            addPropertyToDatabaseObject(req.newInvoice, "userId", req.user.id), {
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
            //Adds the user and invoice ids to the appropriate records before submitting the query
            invoiceItem = addPropertyToDatabaseObject(invoiceItem, "userId", req.user.id);
            invoiceItem = addPropertyToDatabaseObject(invoiceItem, "invoiceId", req.invoice.id);
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


db.invoice.destroy({
    where: {
        userId: "ed8fdd40-b807-4e51-b1f5-90fb5b7f6e73",
        id: "8f045c11-8eda-4c9a-ba57-97e2a69c3559"
    }
}).then(result => console.log(result)).catch(err => console.log(err))



//on updated cascade?
//on delete cascade?

module.exports = {
    getUserInvoices,
    getUserInvoiceById,
    getUserDraftInvoicesById,
    getUserPublishedInvoicesById,
    postUserInvoice,
    deleteUserInvoiceById,
    putUserInvoiceById
};