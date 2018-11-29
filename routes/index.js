/* Require Statements */
const express = require('express');
// const debug = require('debug')('app');
const router = express.Router(); // encapsulate all of our Routes

/** Get schema for all the food posts */
let Post = require('../models/postsModel.js');

/** Routing requests */
router.route('/admin').get((req, res) => {
  /* Retreive all the directory posts from the DB  */
  var newpost = []; //the new array with only events that are currently active

  //query into the postsModel DB, using the find query
  Post.find((err, posts) => {
    if (err) {
      // debug(err);
      console.log(err);
      res.status(404).send(err);
    }
    var count = posts.length;
    for (var i = 0; i < count; i++) {
      newpost.push(posts[i]);
    }
    /* This sends the result of what was retrieved from DB, and sends it 
     * back to the client in JSON */
    res.json(newpost);
  });
});

router.route('/').get((req, res) => {
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
router.route('/').post((req, res) => {
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

router.route('/:postId').delete((req, res) => {
  console.log("deleted");
  /* Deletes the specific postId listing from Database using the remove feature */
  var listing = req.listing;
  listing.remove(function(err){
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.end(); //this allows us to end without dealing with data afterwards
    }
  });
});

router.route('/:postId').put((req, res) => {
  var listing = req.listing;
  listing.voting = listing.voting + 1;
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.json(listing);
    }
  });
});


router.param('postId', (req, res, next, id) => {
  /* Uses the Post DB and finds the specific json object in the DB according the id */
  Post.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(404).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
});


module.exports = router;