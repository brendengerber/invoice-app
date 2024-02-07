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
    
    if(object && typeof object === 'object' && !Array.isArray(object)){
        object[newKey] = newValue;
    }else if(object && Array.isArray(object)){
        for(let index of object){
            addPropertyToDatabaseObject(index, newKey, newValue)
        }
    }
    
    for(let key in object){
        if(object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])){
            addPropertyToDatabaseObject(object[key], newKey, newValue);
        }else if(object[key] && Array.isArray(object[key])){
            for(let index of object[key]){
                addPropertyToDatabaseObject(index, newKey, newValue);
            }
        }
    }
    return object
}


let testObject = {
    property1: {test: "test"},
    property2: [{test2: "test 2"}, [{test3: "test 3"}]],
    property3: [[[{test4: "test4"}]]]
}

console.dir(addPropertyToDatabaseObject(testObject, "id", 5), {depth: null})


//Displays full error message when server is set to development
//Hides full error message when server is set to production to avoid providing information to potential bad actors
function processQueryError(err){
    if(process.env.NODE_ENV === 'development'){
        next(err);
    //Standard Access denied message for production so as to not disclose if a resource exists or not to potential bad actors
    }else{
        next(new Error("Access denied", {statusCode: 401}))
    }
}

///**********possibly not necessary as updates can be done with partials?? */
//Updates properties of a database object with properties sent from a form submit
//Recursive function will check nested objects from associations as well
function updateDatabaseObject(object, objectUpdates){

}

module.exports = {
    unwrapQueryResults,
    checkForEmptyResults,
    addPropertyToDatabaseObject,
    processQueryError
};