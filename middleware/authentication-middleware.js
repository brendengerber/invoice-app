//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments, attatching results to the req object, and handling any errors before passing them up to the error handling middleware with next(err)

require('dotenv').config();

//Though this middleware isn't strictly necessary as req.user will only be attatched to authenticated requests
//It processes the redirect for unlogged in users
//And it is also useful for identifying at a glance which routes are protected routes
const ensureAuthenticated = function(req, res, next){
    try{
        //req.isAuthenticated() will return true if user is logged in
        if(req.isAuthenticated()){
            return next();
        }else{
            res.status(401).send("Please login");    
        }
    }catch(err){
        next(err);
    }
};

module.exports = {
    ensureAuthenticated
};