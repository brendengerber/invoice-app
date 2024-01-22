//Imports necessary modules
const express = require('express');
require('dotenv').config()

//Creates the router
const apiRouter = express.Router();

//Mounts the purchasesRouter
const invoiceRouter = require('./routers/invoice-router.js');
apiRouter.use('/favorites', invoiceRouter);

//Mounts the purchasesRouter
const authRouter = require('./routers/auth-router.js');
apiRouter.use('/auth', authRouter);

//Handles all errors
apiRouter.use((err, req, res, next) => {
    if(!err.status){
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });

//Exports the router
module.exports = apiRouter;