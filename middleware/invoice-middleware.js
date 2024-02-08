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

//*******can include be formatted like gets?
function postUserInvoice(req, res, next){
    db.invoice.create(
        //Adds the user id to the appropriate columns before submitting the query
        addPropertyToDatabaseObject(req.newInvoice, "userId", req.user.id), {
            include:[
                db.invoiceItem
            ]
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

//******same about brackets */
//*********can set up to auto role back transaction?
async function putUserInvoiceById(req, res, next){

    let t;
    try{
        t = await db.sequelize.transaction();
        
        db.invoice.update(
            //Adds the user id to the appropriate columns before submitting the query
            addPropertyToDatabaseObject(req.newInvoice, "userId", req.user.id), {
                where: {
                    id: req.invoiceId,
                    userId: req.user.id,
                }
            }, {transaction: t}).catch(err => {
                next(processQueryError(err));
            })

        const idsToUpdate = req.newInvoice.invoiceItems
        .filter(ingredient => ingredient.id)
        .map(ingredient => ingredient.id)

        db.invoiceItem.destroy({
            where: {
                id: {
                    [db.Sequelize.Op.notIn]: idsToUpdate,
                },
                invoiceId: req.invoice.id
            }
        }, {transaction: t}).catch(err => {
            next(processQueryError(err));
        })

        for(let invoiceItem of req.newInvoice.invoiceItems){
            invoiceItem = addPropertyToDatabaseObject(invoiceItem, "userId", req.user.id);
            invoiceItem = addPropertyToDatabaseObject(invoiceItem, "invoiceId", req.invoice.id);
            db.invoiceItem.upsert(
                invoiceItem, {
                    where: {
                        invoiceId: req.invoice.id,
                        userId: req.user.id
                    }
                }, {transaction: t}
            ).catch(err => {
                next(processQueryError(err));
            })
        } 

        await t.commit();
        next();

    }catch(err){
        if (t) {
            t.rollback().then(delete t);
        }
        next(processQueryError(err));
    }
};












function deleteUserInvoiceById(req, res, next){

}






//on updated cascade?
//on delete cascade?

module.exports = {
    getUserInvoices,
    getUserInvoiceById,
    postUserInvoice,
    deleteUserInvoiceById,
    putUserInvoiceById
};