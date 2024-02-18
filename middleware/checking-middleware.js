//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments, attatching results to the req object, and handling any errors before passing them up to the error handling middleware with next(err)


//Imports necessary modules
const {check} = require('../services/checking-services.js');

//Sanitizes and validates an ID passed in a parameter ensuring it is a UUID and attatches it to req[customProperty]
//Uses a function wrapper so that it can be used to check any parameter of a specified type and attatch the check to the desired req property
//The customProperty argument is a string used to declare where to attach the validated param
//For example the invoice routes use checkParamInteger to attach one number parameter to req.pageNumber and one to req.resultsPerPage
const checkParamId = (customProperty) => {
    return (req, res, next, id) => {
        try{
            req[customProperty] = check.data.id(id);
            next();
        }catch(err){
            next(err);
        }
    };
};

//Sanitizes and validates an integer passed in a parameter and attatches it to req[customProperty]
//Uses a function wrapper so that it can be used to check any parameter of a specified type and attatch the check to the desired req property
//The customProperty argument is a string used to declare where to attach the validated param
//For example the invoice routes use checkParamInteger to attach one number parameter to req.pageNumber and one to req.resultsPerPage
const checkParamInteger = (customProperty) => {
    return (req, res, next, integer) => {
        try{
            req[customProperty] = check.data.integer(integer);            
            next();
        }catch(err){
            next(err);
        }
    };
};

//Sanitizes and validates the format of an invoice submitted in the req.body and attatches it to req.newInvoice
//Standardizes the invoice object by adding userId and invoiceId recursively where appropriate
const checkReqInvoice = (req, res, next) => {
    try{
        req.newInvoice = check.objects.invoice(req.body, {userId: req.user.id, invoiceId: req.invoice?.id});
        next();
    }catch(err){
        next(err);
    }
};

module.exports = {
    checkParamId,
    checkParamInteger,
    checkReqInvoice
};