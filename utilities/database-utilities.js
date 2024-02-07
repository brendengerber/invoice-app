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
        if(process.env.NODE_ENV === development){
            throw new Error("The query returned no results", {statusCode: 404});
        }else{
            //Standard Access denied message for production so as to not disclose if a resource exists or not to potential bad actors
            throw new Error("Access denied", {statusCode: 401});
        }
    }
};

//Adds userId property to database objects sent via form submits
//Recursive function will check nested objects from associations as well
function addUserIdToDatabaseObject(object, id){
    object.userId = id;
    for(key in object){
        if(object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])){
            addUserIdToDatabaseObject(object[key], id);
        }else if(object && Array.isArray(object[key])){
            for(let index of object[key]){
                addUserIdToDatabaseObject(index, id);
            }
        }
    }
    return object
}


///**********possibly not necessary as updates can be done with partials?? */
//Updates properties of a database object with properties sent from a form submit
//Recursive function will check nested objects from associations as well
function updateDatabaseObject(object, objectUpdates){

}

module.exports = {
    unwrapQueryResults,
    checkForEmptyResults,
    addUserIdToDatabaseObject
};