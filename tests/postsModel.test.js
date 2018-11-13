var should = require('should'),
    mongoose = require('mongoose'),
    Post = require('../models/postsModel');

var post, id;

post =  {
  organization: 'Pizza Club',
  eventname: 'Pizza club meeting',
  typeoffood: 'Pizza',
  vegetarian: false,
  vegan: false,
  building: 'Frazier Hall',
  address: '1741 Museum Rd',
  city: 'Gainesville',
  state: 'Florida',
  zipcode: 33609,
  date: 'Jan 1 2020',
  timefrom: '3:30',
  timeto: '5:30',
  voting: 5
}

describe('Post Schema Unit Tests', function() {

  before(function(done) {
    mongoose.connect('mongodb://foodBabyUser:group3@ds115971.mlab.com:15971/foodbaby');
    done();
  });

  describe('Saving to database', function() {
    /*
      Mocha's default timeout for tests is 2000ms. To ensure that the tests do not fail
      prematurely, we can increase the timeout setting with the method this.timeout()
     */
    this.timeout(10000);

    it('saves properly when only requiered properties provided', function(done){
      new Post({
        organization: post.organization,
        eventname: post.eventname,
        typeoffood: post.typeoffood,
        building: post.building,
        address: post.address,
        city: post.city,
        state: post.state,
        zipcode: post.zipcode,
        date: post.date,
        timefrom: post.timefrom,
        timeto: post.timeto
      }).save(function(err, post){
        should.not.exist(err);
        id = post._id;
        done();
      });
    });

    it('saves properly when all three properties provided', function(done){
      new Post(post).save(function(err, post){
        should.not.exist(err);
        id = post._id;
        done();
      });
    });

    it('throws an error when name not provided', function(done){
      new Post({
        organization: post.organization,
        typeoffood: post.typeoffood,
        vegetarian: post.vegetarian,
        vegan: post.vegan,
        building: post.building,
        address: post.address,
        city: post.city,
        state: post.state,
        zipcode: post.zipcode,
        date: post.date,
        timefrom: post.timefrom,
        timeto: post.timeto,
        voting: post.voting
      }).save(function(err){
        should.exist(err);
        done();
      })
    });

    it('throws an error when type of food not provided', function(done){
      new Post({
        organization: post.organization,
        eventname: post.eventname,
        vegetarian: post.vegetarian,
        vegan: post.vegan,
        building: post.building,
        address: post.address,
        city: post.city,
        state: post.state,
        zipcode: post.zipcode,
        date: post.date,
        timefrom: post.timefrom,
        timeto: post.timeto,
        voting: post.voting
      }).save(function(err){
        should.exist(err);
        done();
      })
    });

  });

  afterEach(function(done) {
    if(id) {
      Post.remove({ _id: id }).exec(function() {
        id = null;
        done();
      });
    } else {
      done();
    }
  });
});
