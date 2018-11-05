/* Require Statements */
const express = require('express');
const debug = require('debug');
const router = express.Router(); // encapsulate all of our Routes

/** Get schema for all the food posts */
let Post = require('../models/postsModel.js');

/** Routing requests */
router.route('/').get((req, res) => { 
  /* Retreive all the directory posts from the DB */
  Post.find((err, posts) => {
    if(err){
      // Print a debug statement, need to include the debug require tag
      // res.status(404).send(err);
      // OR
      // next(err); // hand it back to the error handling function
    }
    /* This sends the result of what was retrieved from DB, and sends it 
     * back to the client in JSON */
    res.json(posts); 
  });
});
router.route('/').post((req, res) => {
  /* Sending data to the database that was submitted in the form */
  // Date && Time conversions before submitting to DB
  var tempDate = req.body.date;
  var tempTimeFrom = req.body.timefrom;
  var tempTimeTo = req.body.timeto;
  req.body.date = tempDate.substring(0,10);
  req.body.timefrom = tempTimeFrom.substring(11,16);
  req.body.timeto = tempTimeTo.substring(11,16);

  var post = new Post(req.body); // creates a new post object
  // send the post object into the DB aka save it
  post.save((err) => { 
    if(err){}
    res.json(post);
  })
});

router.route('/:postId').get((req, res) => {
  // send back the listing as json from the request
  res.json(req.post);
});


module.exports = router;