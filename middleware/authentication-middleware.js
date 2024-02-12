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