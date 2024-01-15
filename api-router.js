//Imports necessary modules
const express = require('express');
require('dotenv').config()

//Creates the router
const apiRouter = express.Router();

//Mounts the purchasesRouter
const favoritesRouter = require('./routers/favorites-router.js');
apiRouter.use('/favorites', favoritesRouter);

//Mounts the purchasesRouter
const authenticationRouter = require('./routers/authentication-router.js');
apiRouter.use('/authentication', authenticationRouter);

//Handles all errors
apiRouter.use((err, req, res, next) => {
    if(!err.status){
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });

//Exports the router
module.exports = apiRouter;