/* Require Statements */
const express = require('express');
const jwt = require('jsonwebtoken');
var secret = 'pickles'; //private

const router = express.Router(); // encapsulate all of our Routes

/** Get schema for all the food posts */
var Post = require('../models/postsModel.js');
/** Get schema for User model */
var User = require('../models/user.js');

//USER REGISTRATION ROUTE
router.post('/users', (req, res) => {
  // https://localhost:port/api/users
  var user = new User(); // Create new User object
  user.username = req.body.username; // Save username from request to User object
  user.password = req.body.password; // Save password from request to User object
  user.email = req.body.email; // Save email from request to User object
  if (req.body.username == null || req.body.username == "" || req.body.password == null ||
    req.body.password == "" || req.body.email == null || req.body.email == "") {
    res.json({
      success: false,
      message: "Ensure username, password, and email are provided"
    });
  } else {
    user.save((err) => {
      if (err) {
        res.json({
          success: false,
          message: 'Username or Email already exists'
        });
      } else {
        res.json({
          success: true,
          message: 'User was successfully created'
        });
      }
    });
  }
});


//USER LOGIN ROUTE
router.post('/authenticate', (req, res) => {
  // https://localhost:port/api/authenticate
  /** Search for user by username in DB */
  User.findOne({
      username: req.body.username
    })
    .select('email username password').exec((err, user) => {
      if (err) {
        throw err;
      }
      if (!user) { //user does not exist
        res.json({
          success: false,
          message: 'Could not authenticate user'
        });
      } else if (user) { //user exists, then do password validation
        if (req.body.password) { //if they entered a password
          var validPassword = user.comparePassword(req.body.password);
        } else {
          res.json({
            success: false,
            message: 'No password provided'
          });
        }
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Could not authenticate password'
          });
        } else {
          var token = jwt.sign({
            username: user.username,
            email: user.email
          }, secret, {
            // token will expire in 24 hours
            expiresIn: '24h'
          });
          res.json({
            success: true,
            message: 'User authenticated',
            token: token
          });
        }
      }

    });

});
 // Middleware for Routes that checks for token -
 // Place all routes after this route that require the user to already be logged in
router.use(function(req, res, next) {
  // Check for token in body, URL, or headers
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
  if (token) {
    //verify token symmetric
    jwt.verify(token, secret, function (err, decoded) {
      if(err){
        res.json({
          success: false, 
          message: 'Token invalid'
        });
      }else{
        //have a token and it is verified
        // assign to local variable
        req.decoded = decoded;
        next(); //continues out to next route
      }
    });
  } else {
    res.json({
      success: true,
      message: 'No token provided'
    });
  }
});
// Route to get the currently logged in user    
router.post('/me', function (req, res) {
  //get token decrypted and send back to user
  res.send(req.decoded);
});

//-------------------------------------------------------------------------
//USER REGISTRATION ROUTE
router.get('/posts', (req, res) => {
  /* Retreive all the directory posts from the DB  */
  var newpost = []; //the new array with only events that are currently active

  Post.find((err, posts) => {
    if (err) {
      // debug(err);
      console.log(err);
      res.status(404).send(err);
    }
    var today = new Date();
    var todaysYear = today.getFullYear();
    var todaysMonth = today.getMonth() + 1;
    var todaysDay = today.getDate();
    var count = posts.length;
    for (var i = 0; i < count; i++) {
      var currDate = posts[i].date;
      var currYear = parseInt(currDate.substring(0, 4));
      var currMonth = parseInt(currDate.substring(5, 7));
      var currDay = parseInt(currDate.substring(8));
      if (currYear < todaysYear) {} else if (currYear == todaysYear) {
        if (currMonth < todaysMonth) {} else if (currMonth == todaysMonth) {
          if (currDay < todaysDay) {} else {
            //show since this date has not happened yet
            //also will need to compare time ****
            newpost.push(posts[i]);
          }
        } else {
          //show since this date has not happened yet
          newpost.push(posts[i]);
        }
      } else {
        //show since this date has not happened yet
        newpost.push(posts[i]);
      }
    }
    /* This sends the result of what was retrieved from DB, and sends it 
     * back to the client in JSON */
    res.json(newpost);
  });
});

router.post('/posts', (req, res) => {
  /* Sending data to the database that was submitted in the form */
  // Date && Time conversions before submitting to DB
  var tempDate = req.body.date;
  var tempTimeFrom = req.body.timefrom;
  var tempTimeTo = req.body.timeto;
  req.body.date = tempDate.substring(0, 10);
  req.body.timefrom = tempTimeFrom.substring(11, 16);
  req.body.timeto = tempTimeTo.substring(11, 16);

  /* Create a new object of the Post DB and then we will save it to the DB */
  var post = new Post(req.body); // creates a new post object
  // send the post object into the DB aka save it
  post.save((err) => {
    if (err) {
      // debug(err);
      console.log(err);
      res.status(404).send(err);
    }
    res.json(post);
  })
});

// // router.route('/:postId').delete((req, res) => {
// //   console.log("deleted");
// //   /* Deletes the specific postId listing from Database using the remove feature */
// //   var listing = req.listing;
// //   listing.remove(function (err) {
// //     if (err) {
// //       console.log(err);
// //       res.status(404).send(err);
// //     } else {
// //       res.end(); //this allows us to end without dealing with data afterwards
// //     }
// //   });
// // });

// router.post('/:postId', (req, res) => {
//   console.log("here?");
//   var listing = req.listing;
//   listing.voting = listing.voting + 1;
//   listing.save(function (err) {
//     if (err) {
//       console.log(err);
//       res.status(404).send(err);
//     } else {
//       res.json(listing);
//     }
//   });
// });


// router.param('postId', (req, res, next, id) => {
//   /* Uses the Post DB and finds the specific json object in the DB according the id */
//   Post.findById(id).exec(function (err, listing) {
//     if (err) {
//       res.status(404).send(err);
//     } else {
//       req.listing = listing;
//       next();
//     }
//   });
// });

module.exports = router;