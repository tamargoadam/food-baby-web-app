/* Require Statements */
const express = require('express');
// const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan'); // this gives us a lot of information
const path = require('path'); // included already
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // necessary for routing info from client to server

const Router = require('./routes/index.js'); //gets the Router so we can use it

/** 1. connect to Database */
// TODO: place URI in seperate file to gitignoe for github in future
mongoose.connect('mongodb://foodBabyUser:group3@ds115971.mlab.com:15971/foodbaby'); // this is the URI of mongo DB in mLab

// /** Get schema for all the food posts */
// const Post = require('../models/postsModel.js');

/** 2. creates an instance of express so I can use -> initializes the app */
const app = express(); 

/** 3. logging for debugging using morgan && bodyparsing json */
app.use(morgan('tiny'));
app.use(bodyParser.json());

/** 4. Serving static files */
app.use(express.static(path.join(__dirname, 'client/public/')));
// checks if the file is not in public directory check the node_modules directory
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular-route')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/angular-ui-router/release')));

/** 5. Use the router for requests to the api */
app.use('/api/posts', Router);

/** 6. Go to homepage for route specified */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html')); // send the response to the index page
});

/** 7. When it starts listening on the port, it will execute the callback function */
const port = process.env.PORT || 4000;
app.listen(port, () => {
  // debug(`Listening on port `);
  console.log(`Listing on port ${chalk.green(port)}`);
});
