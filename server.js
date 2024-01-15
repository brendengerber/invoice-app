//Imports necessary modules
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const {config} = require('./config.js');
const cors = require('cors');
require('dotenv').config()

const app = express();

//Remove after development to minimize unnecessary realtime logs on server
app.use(morgan('tiny'));

//Enables cors to allow for Swagger tests on localhost
//Remove once app is hosted
app.use(cors());

//Security measures
app.use(helmet());
app.disable('x-powered-by');

//Parses request bodies to json
app.use(express.json());

//Mounts the api router
const apiRouter = require('./api-router.js');
app.use('/api', apiRouter);

//Sets the port and starts the server
const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
  