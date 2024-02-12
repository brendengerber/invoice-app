//These middlewares uses a function wrapper so that it can be used to check any parameter of a specified type and attatch the check to the desired req property
//The customProperty argument is a string used to declare where to attach the validated id
//For example the invoice page routes use checkParamNumber to attach one number parameter to req.pageNumber and one to req.resultsPerPage

//Imports necessary modules
const {check} = require('../services/checking-services.js');

//Sanitizes and validates an ID passed in a parameter ensuring it is a UUID and attatches it to req[customProperty]
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
//**************needs checking logic still */
const checkReqInvoice = (req, res, next) => {
    try{
        req.newInvoice = req.body;
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