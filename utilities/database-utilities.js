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
    processQueryError
};