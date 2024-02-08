require('dotenv').config();

//Unwraps the results from a sequelize query to remove metadata and allow access to results at the top level of the object
function unwrapQueryResults(results){
    let unwrappedResults;
    if(Array.isArray(results)){
        unwrappedResults = [];
        for (let result of results){
            if(result.get){
                unwrappedResults.push(result.get({ plain: true }));
            } 
        }
    }else{
        unwrappedResults = results.get({ plain: true });
    }
    return unwrappedResults
};

//Checks for empty results and throws an error if the query returned no results
function checkForEmptyResults(results){
    if(results === undefined || results === null || results.length === 0){
        throw new Error("The query returned no results", {statusCode: 404});   
    }
};

//Adds property to database objects sent via form submits
//Recursive function will add the property to nested objects from associations as well
//Object is the object to update, newKey is a string for the key to be added, and newValue is the newKey's corresponding value
//Useful for adding ids, userIds, invoiceIds, etc to objects with associations
function addPropertyToDatabaseObject(object, newKey, newValue){
    //If the object is an object and not an array, adds the new key/value pair
    //Important in case a property with type of string, number, float, etc is passed in
    if(object && typeof object === 'object' && !Array.isArray(object)){
        object[newKey] = newValue;
    }
    
    //Loops over all the keys in the object calling the function on them if they are of type object
    //In case the object is an array, this will also loop through the array and call the function on each index
    for(let key in object){
        //In case the object is not an array, calls the function on it
        if(object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])){
            addPropertyToDatabaseObject(object[key], newKey, newValue); 
        //In case the object is an array, loops over the array, and calls the function on each index
        }else if(object[key] && Array.isArray(object[key])){
            for(let index of object[key]){
                addPropertyToDatabaseObject(index, newKey, newValue);
            }
        }
    }
    return object
};

//Displays full error message when server is set to development
//Hides full error message when server is set to production to avoid providing information to potential bad actors
function processQueryError(err){
    if(process.env.NODE_ENV === 'development'){
        return err
    //Standard Access denied message for production so as to not disclose if a resource exists or not to potential bad actors
    }else{
        return new Error("Access denied", {statusCode: 401})
    }
};

module.exports = {
    unwrapQueryResults,
    checkForEmptyResults,
    addPropertyToDatabaseObject,
    processQueryError
};