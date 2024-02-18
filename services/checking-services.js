//This file contains services that validate user submitted data and return a sanatized version
//These functions will also standardize objects when possible by adding any ids that were missing (if provided)
//They are kept separate not only to reuse, but also to separate functionality

//Imports necessary modules
const validator = require('validator');
const Schema = require('validate');
require('dotenv').config();
const {addPropertyToObject} = require('../utilities/checking-utilities.js');

//Schemas used to validate standard objects
schemas = {
    //Creates a schema to validate invoice objects
    invoice: new Schema({
        id: {
            type: String,
            required: false
        },
        userId: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: false
        },
        invoiceNumber: {
            type: Number,
            required: false
        },
        billFromStreetAddress: {
            type: String,
            required: false
        },
        billFromCity: {
            type: String,
            required: false
        },
        billFromPostalCode: {
            type: String,
            required: false
        },        
        billFromCountry: {
            type: String,
            required: false
        },
        billToName: {
            type: String,
            required: false
        },
        billToEmail: {
            type: String,
            required: false
        },
        billToStreetAddress: {
            type: String,
            required: false
        },
        billToCity: {
            type: String,
            required: false
        },
        billToPostalCode: {
            type: String,
            required: false
        },
        billToCountry: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: false
        },
        paymentTerms: {
            type: String,
            required: false
        },
        projectDescription: {
            type: String,
            required: false
        },
        amountDue: {
            type: Number,
            required: false
        },
        createdAt: {
            type: String,
            required: false
        },
        updatedAt: {
            type: String,
            required: false
        },
        invoiceItems: [{
            id: {
                type: String,
                required: false
            },
            invoiceId: {
                type: String,
                required: false
            },
            userId: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            quantity: {
                type: Number,
                required: false
            },
            price: {
                type: Number,
                required: false
            },
            total: {
                type: Number,
                required: false
            },
            createdAt: {
                type: String,
                required: false
            },
            updatedAt: {
                type: String,
                required: false
            },
        }]
    //Prevents users from submitting un listed properties
    }, {strict: true}),
};

//Used to validate and sanatize data and standard objects
const check = {
    //Methods that validate a single piece of data and return a sanatized version
    data:{
        //Validates an id using a regular expression to ensure it conforms to the v4 UUID standard and throws an error if not
        //Sanitizes input strings to prevent xss
        //"id" is a string to validate
        //If provided with either null or undefined, returns null or undefined
        id: function(id){
            if(id){
                if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
                    return validator.escape(id);
                }else{
                    throw new Error(`Error: the ID ${id} is not a valid v4 UUID.`);
                }
            }else{
                return id;
            }
        },
        //Validates date properties of submitted entries to ensure they conforms to the YYYY-MM-DD date format
        //Sanitizes input strings to prevent xss
        //"date" is a string to validate
        //If provided with either null or undefined, returns null or undefined
        date: function(date){
            if(date){
                if(validator.isDate(date, {format: 'YYYY-MM-DD', delimiters: ['-']})){
                    return validator.escape(date);
                }else{
                    throw new Error(`Error: the date ${date} does not follow the YYYY-MM-DD date format.`);
                }
            }else{
                return date;
            }
        },
        //Sanitizes input strings to prevent xss
        //If provided with either null or undefined, returns null or undefined
        string: function(string){
            if(string){
                if(typeof string !== 'string'){
                    throw new Error(`The string ${string} is not of type string.`);
                }else{
                    return validator.escape(string);
                }
            }else{
                return string;
            }
        },
        //The "integer" argument can be a string or a number, and returns an integer
        //Sanitizes/escapes input strings to prevent xss
        //Validates integer values to ensure that they are integers and throws an error if not
        //If provided with either null or undefined, returns null or undefined
        integer: function(integer){
            if(integer){
                //Converts integer from a number to a string (if it isn't already) for validation and escaping
                integer = integer.toString();
                integer = validator.escape(integer);
                if(!validator.isInt(integer)){
                    throw new Error(`The integer ${integer} is not of type integer.`);
                }else{
                    //Converts integer back to a type number
                    return Number(integer);
                }
            }else{
                return integer;
            }
        },
        //The "money" argument can be a string or a number, and returns a number
        //Sanitizes/escapes input strings to prevent xss
        //Validates money values to ensure that they conforms to the xxx.xx currency format and throws an error if not
        //Money with either 2, 1, or 0 decimals and no comma separators will validate
        //If provided with either null or undefined, returns null or undefined
        money: function(money){    
            if(money){
                //Converts money from a number to a string (if it isnt already) for validation and escaping
                money = money.toString();
                money = validator.escape(money);
                if(!validator.isCurrency(money, {thousands_separator: '', digits_after_decimal: [0, 1, 2]})){
                    throw new Error(`Error: the budget ${money} does not follow the xxx.xx currency format.`);
                }else{
                    //Converts money back to a type number
                    return Number(money);
                }
            }else{
                return money;
            }
        },
    },
    //Methods that validate an entire standard object consisting of individual pieces of data
    //Uses the validation methods above to validate and sanitize all entries 
    objects: {
        //Validates an invoice object
        //First argument is an invoice object to validate (likely user submitted)
        //Second argument is an optional id object of ids to add recursively to the invoice and invoiceItems objects to standardize them {userId: someUUID, invoiceId: someUUID}
        //Can be used to validate existing invoices with assigned UUIDs or new invoices awaiting assignment
        //If the invoice does not yet have a UUID the id property will be set to undefined, and if one was provided it will throw an error (to ensure all UUIDs are assigned by the database server)
        invoice: function(invoice, ids){
            //Adds invoice id and userId recursively where appropriate in case they do not already exist from the object sent by the frontend
            //Allows invoice objects to be sent from frontend without id properties
            //Overrides any existing ids in the invoice object with the provided ids (likely from parameters etc) to prevent id mismatches or user assigned uuids submitted in req bodies
            if(ids.userId){
                addPropertyToObject(invoice, "userId", ids.userId);
            } 
            invoice.id = ids.invoiceId;
            if(invoice.invoiceItems){
                for(let invoiceItem of invoice.invoiceItems){
                    invoiceItem.invoiceId = ids.invoiceId;
                }
            }
            //Validate's the invoice object's properties
            let validationErrors;
            validationErrors = schemas.invoice.validate(invoice);
            //Sanitizes an invoice object and validates datatypes
            try{
                invoice.id = check.data.id(invoice.id);
            }catch(err){
                validationErrors.push(err.message);
            }

            try{
                invoice.userId = check.data.id(invoice.userId);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.status = check.data.string(invoice.status);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.invoiceNumber = check.data.integer(invoice.invoiceNumber);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billFromStreetAddress = check.data.string(invoice.billFromStreetAddress);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billFromCity = check.data.string(invoice.billFromCity);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billFromPostalCode = check.data.string(invoice.billFromPostalCode);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billFromCountry = check.data.string(invoice.billFromCountry);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToName = check.data.string(invoice.billToName);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToEmail = check.data.string(invoice.billToEmail);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToStreetAddress = check.data.string(invoice.billToStreetAddress);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToCity = check.data.string(invoice.billToCity);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToPostalCode = check.data.string(invoice.billToPostalCode);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.billToCountry = check.data.string(invoice.billToCountry);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.date = check.data.date(invoice.date);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.paymentTerms = check.data.string(invoice.paymentTerms);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.projectDescription = check.data.string(invoice.projectDescription);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.amountDue = check.data.money(invoice.amountDue);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.createdAt = check.data.date(invoice.createdAt);
            }catch(err){
                validationErrors.push(err.message);
            }
            try{
                invoice.updatedAt = check.data.date(invoice.updatedAt);
            }catch(err){
                validationErrors.push(err.message);
            }
            //Validates and sanitizes the invoice items of an invoice
            for(let invoiceItem of invoice.invoiceItems){
                try{
                    invoiceItem.id = check.data.id(invoiceItem.id);
                    
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.invoiceId = check.data.id(invoiceItem.invoiceId);
                    
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.userId = check.data.id(invoiceItem.userId);
                    
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.name = check.data.string(invoiceItem.name);
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.quantity = check.data.integer(invoiceItem.quantity);
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.price = check.data.money(invoiceItem.price);
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.total = check.data.money(invoiceItem.total);
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.createdAt = check.data.date(invoiceItem.createdAt);
                }catch(err){
                    validationErrors.push(err.message);
                }
                try{
                    invoiceItem.updatedAt = check.data.date(invoiceItem.updatedAt);
                }catch(err){
                    validationErrors.push(err.message);
                }                     
            }
            //Checks if any errors have been recorded and if not, returns the envelope
            if(validationErrors.length === 0){
                return invoice;
            //In case of errors, creates and throws a new error object describing all invalid formatting
            }else{
                //Throws the detailed error message if the server is set to development
                if(process.env.NODE_ENV === 'development'){
                    const err = new Error(`The invoice format is invalid.\n ${validationErrors.join("\n")}`);
                    err.status = 400;
                    throw err;
                }else{
                    //Throws a non specific error if server is set to production in order to avoid giving detailed information to potentially bad actors
                    throw new Error ("The server encountered an unknown error", {statusCode: 500});
                }
            }
        }
    }
};

//Exports to be used in other modules
module.exports = {
    check
};
