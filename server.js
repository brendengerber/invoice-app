//Imports necessary modules
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const {config} = require('./config.js');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('./config/passport.js');

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

//Initializes passport to be used on all routes
app.use(passport.initialize());
app.use(passport.session());

//Allows images from github to load
app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "img-src self https://avatars.githubusercontent.com");
  return next();
});

//Express session set up to be used on all routes
//***********Need to set up storrage */
//***********Add secure when https is set up and samesite? */
app.use(
  session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 *60 * 24 }
  })
);

//Mounts the api router
const apiRouter = require('./api-router.js');
app.use('/', apiRouter);

//Sets the port and starts the server
const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
  