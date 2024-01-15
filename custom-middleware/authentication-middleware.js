const ensureAuthenticated = function(req, res, next){
    //req.isAuthenticated() will return true if user is logged in
    if(req.isAuthenticated()){
        return next();
    }else{
        const err = new Error("Unauthorized Access");
        err.status = 401;
        next(err);  
    }
};

module.exports = {
    ensureAuthenticated
};