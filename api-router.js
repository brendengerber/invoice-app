//Imports necessary modules
const express = require('express');
require('dotenv').config()

//Creates the router
const apiRouter = express.Router();

//Mounts the purchasesRouter
const favoritesRouter = require('./routers/favorites-router.js');
apiRouter.use('/favorites', favoritesRouter);

//Handles all unhandled errors
apiRouter.use((err, req, res, next) => {
    if(!err.status){
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });

//Exports the router
module.exports = apiRouter;