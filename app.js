/* Require Statements */
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan'); // this gives us a lot of information
const path = require('path'); // included already
const mongoose = require('mongoose');
// body parser - parses the data into json
const bodyParser = require('body-parser'); // necessary for routing info from client to server
const passport = require('passport');

/** 1. creates an instance of express so I can use -> initializes the app */
const app = express();
const social = require('./server/passport/passport')(app, passport);

const Router = require('./server/routes/index.js'); //gets the Router so we can use it

/** 2. connect to Database
 * this is the URI of mongo DB in mLab
 */
mongoose.connect('mongodb://foodBabyUser:group3@ds115971.mlab.com:15971/foodbaby', (err) => {
  if (err) {
    console.log(`Not connected to the database: ${chalk.red(err)}`); // Log to console if unable to connect to database
  } else {
    console.log('Successfully connected to MongoDB'); // Log to console if able to connect to database
  }
});


/** 3. logging for debugging using morgan && bodyparsing json */
app.use(morgan('dev')); //everytime a request is made to the server, it will log it for you
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); // For parsing application/x-www-form-urlencoded


/** 4. Serving static files 
 * front end has public access to everything in this folder
 */
app.use(express.static(path.join(__dirname, 'client/public/')));
// checks if the file is not in public directory check the node_modules directory
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular-route')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular-ui-router/release')));

/** 5. Use the router for requests to the api 
 * Assign name to end points (e.g., '/api/posts/', '/api/users' ,etc. )
 */
app.use('/api', Router);
// app.use('/api/posts', Router);

/** 6. Go to homepage for route specified */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html')); // send the response to the index page
});


/** 7. When it starts listening on the port, it will execute the callback function 
 * use port 4000 or if the server we are deploying to has a specific port use that -> 
 * process.env.PORT
 */
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listing on port ${chalk.green(port)}`);
});