//Imports necessary modules
const express = require('express');
require('dotenv').config();
const passport = require('../config/passport.js');

//Creates the router
const authRouter = express.Router();

//Authenticates via github oauth
authRouter.get('/github', passport.authenticate('github', {scope: ['user']}));

function addTestReq (req, res, next){
    req.test = 'this is a test, req handded through ';
    next();
}

//Callback route which Github will call following the authentication attempt
//User will be redirected based on the success of the authentication attempt
//*******If this doesnt work with frontend, might need to change redirects to a call back that sends that stuff? */
//**********remove addTestReq */
// authRouter.get('/github/callback', addTestReq, passport.authenticate('github', {
//     failureRedirect: `/authentication/failure`,
//     successRedirect: `/authentication/success`
// }));

// //Redirects callback redirects from Oauth to the front end pages not hosted on the api subdomain
// authRouter.get('/failure', (req, res, next) => {
//     res.status(401).send();
// });

// //*******change back to sending user after testing if the test goes through */
// authRouter.get('/success', (req, res, next) => {
//     console.log(req.test)
//     res.status(200).send(req.test, 'test');
// });

//*****If this works add the frontend base url to .env.example and dokku config files and refactor below to use it */
//*********if this works, redirect to a success route that sends the user object and redirects to dashboard */
if(process.env.NODE_ENV === 'production'){
    authRouter.get('/github/callback', passport.authenticate('github', {
        failureRedirect: `api.invoice-app.naughty-cat.com/login`,
        successRedirect: `api.invoice-app.naughty-cat.com/dashboard`
    }));
}else if(process.env.NODE_ENV === 'development'){
    authRouter.get('/github/callback', passport.authenticate('github', {
        failureRedirect: `http://localhost:3000/login`,
        successRedirect: `http://localhost:3000/dashboard`
    }));
}

//Logs out of any open passport session
authRouter.post('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    })
})

module.exports = authRouter;