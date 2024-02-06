//****Need to add actual checking logic here, as of now it only attatches for subsequent middleware to use as expected */

//Sanitizes and validates an ID ensuring it is a number and attatches it to req.customProperty
//This middleware uses a function wrapper so that it can be used even in routes that have multiple IDs such as transfer
//The customProperty argument is a string used to declare where to attach the validated id
//For example the transfer route attaches one Id parameter to req.fromId and one Id parameter to req.toId
const checkParamId = (customProperty) => {
    return (req, res, next, id) => {
        try{
            req[customProperty] = id;
            next();
        }catch(err){
            next(err);
        }
    };
};

//Sanitizes and validates the format of an invoice submitted in the req.body and attatches it to req.newInvoice
const checkReqInvoice = (req, res, next) => {
    try{
        req.newInvoice = req.body;
        next();
    }catch(err){
        next(err);
    }
}

module.exports = {
    checkParamId,
    checkReqInvoice
};