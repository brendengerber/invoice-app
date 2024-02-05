//Unwraps the results from a sequelize query to remove metadata and allow access to results at the top level of the object
function unwrapQueryResults(results){
    //Throws an error in case of an unfound result
    if(results === undefined || results === null || results.length === 0){
        //Standard Access denied message here so as to not disclose if a resource exists or not to potential bad actors
        throw new Error("Access denied", {statusCode: 401});
    }
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

module.exports = {
    unwrapQueryResults
};