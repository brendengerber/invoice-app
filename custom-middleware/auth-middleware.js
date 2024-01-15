require('dotenv').config();

const ensureAuthenticated = function(req, res, next){
    //req.isAuthenticated() will return true if user is logged in
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect(process.env.LOGIN_URL);    
    }
};

module.exports = {
    ensureAuthenticated
};