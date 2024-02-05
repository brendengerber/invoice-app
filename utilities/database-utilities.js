
//Unwraps the results from a sequelize query to remove metadata and allow access to results at the top level of the object
function unwrapQueryResults(results){
    //Throws an error in case of an unfound result
    if(results === undefined || results === null || results.length === 0){
        throw new Error("The requested resources does not exist.", {statusCode: 404});
    }
    let unwrappedResults;
    if(Array.isArray(results)){
        unwrappedResults = [];
        for (result of results){
            unwrappedResults.push(result.get({ plain: true }));
        }
    }else{
        unwrappedResults = results.get({ plain: true });
    }
    return unwrappedResults
};

module.exports = {
    unwrapQueryResults
};