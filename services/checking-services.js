//This file contains services that validate user submitted data and return a sanatized version
//They are kept separate not only to reuse, but also to separate functionality

//Imports necessary modules
const validator = require('validator');
const Schema = require('validate');

//Used to validate and sanatize data and standard objects
const check = {
    //Methods that validate a single piece of data and return a sanatized version
    data:{
        //Validates money values to ensure that they conforms to the xxxx.xx currency format and throws an error if not
        //Sanitizes input strings to prevent xss
        //Money with either 2, 1, or 0 decimals and no comma separators will validate
        //"money" is a string to validate
        money: function(money){    
            if(validator.isCurrency(money.toString(), {thousands_separator: '', digits_after_decimal: [0, 1, 2]})){
                return validator.escape(money);
            }else{
                const err = new Error(`Error: the budget ${money} does not follow the xxxx.xx currency format.`);
                err.status = 400;
                throw err;
            }
        },
        //Validates an id using a regular expression to ensure it conforms to the v4 UUID standard and throws an error if not
        //Sanitizes input strings to prevent xss
        //"id" is a string to validate
        id: function(id){
            if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
                return validator.escape(id);
            }else{
                const err = new Error(`Error: the ID ${id} is not a valid v4 UUID.`);
                err.status = 400;
                throw err;
            }
        },
        //Validates date properties of submitted entries to ensure they conforms to the YYYY-MM-DD date format
        //Sanitizes input strings to prevent xss
        //"date" is a string to validate
        date: function(date){
            if(validator.isDate(date, {format: 'YYYY-MM-DD', delimiters: ['-']})){
                return validator.escape(date);
            }else{
                const err = new Error(`Error: the date ${date} does not follow the YYYY-MM-DD date format.`);
                err.status = 400;
                throw err;
            }
        },
        //Sanitizes input strings to prevent xss
        string: function(string){
            try{
                if(typeof string !== 'string'){
                    throw new Error(`The string ${string} is not of type string.`);
                }else{
                    return validator.escape(string);
                }
            }catch(err){
                return(err);
            }
        },
        //Sanitizes input integers to prevent xss and converts them to type integer
        integer: function(integer){
            try{
                integer = parseInt(validator.escape(integer));
                if(!Number.isInteger(integer)){
                    throw new Error(`The integer ${integer} is not of type integer.`);
                }else{
                    return integer;
                }
            }catch(err){
                return(err);
            }
        }
    },
    //****************add invoice validation */
    //*************redo these comments to be for this project, not envelopes */
    //Methods that validate an entire standard object consisting of individual pieces of data
    //Use the validate methods above to validate and sanitize all entries 
    objects: {
        //Validates an envelope object
        //First argument is an envelope object to validate
        //Second argument is an optional id if you want to test that the envelope in question matches a certain id (i.e. an id sent via parameters etc)
        //Can be used to validate existing envelopes with assigned v4 UUID or new envelopes awaiting assignment
        //A successfully validated envelope will conform to {id: v4 UUID string/undefined, category: string, budget: xxxx.xx number}
        //If the envelope does not yet have a v4 UUID the id property will be set to undefined
   
    }
};

//Exports to be used in other modules
module.exports = {
    check
};
