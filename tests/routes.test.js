var should = require('should'),
    request = require('supertest'),
    express = require('../app.js'),
    Post = require('../models/postsModel.js');

/* Global variables */
var app, agent, post, id;

/* Unit tests for testing server side routes for the posts API */
describe('Posts CRUD tests', function() {

  this.timeout(10000);

//TODO: find way to connect to app
  before(function(done) {
    app = express.init();
    agent = request.agent(app);

    done();
  });

  it('should it able to retrieve all posts', function(done) {
    agent.get('/api/posts')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.length(2);
        done();
      });
  });

  /*
  it('should be able to retrieve a single Post', function(done) {
    Post.findOne({eventname: 'GBM'}, function(err, post) {
      if(err) {
        console.log(err);
      } else {
        agent.get('/api/posts/' + post._id)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            should.exist(res);
            res.body.eventname.should.equal('GBM');
            res.body.typeoffood.should.equal('Pizza');
            res.body.address.should.equal('1234 University Dr');
            res.body._id.should.equal(post._id.toString());
            done();
          });
      }
    });
  });
  */

  it('should be able to save a post', function(done) {
    var post = {
      organization: 'Pizza Club',
      eventname: 'Pizza club meeting',
      typeoffood: 'Pizza',
      vegetarian: False,
      vegan: False,
      building: 'Frazier Hall',
      address: '1741 Museum Rd',
      city: 'Gainesville',
      state: 'Florida',
      zipcode: 33609,
      date: 'Jan 1 2020',
      timefrom: '3:30',
      timeto: '5:30',
      voting: 5
    };
    agent.post('/api/posts')
      .send(post)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res.body._id);
        res.body.organization.should.equal('Pizza Club');
        res.body.eventname.should.equal('Pizza club meeting');
        res.body.typeoffood.should.equal('Pizza');
        res.body.vegetarian.should.equal(False);
        res.body.vegan.should.equal(False);
        res.body.building.should.equal('Frazier Hall');
        res.body.address.should.equal('1741 Museum Rd');
        res.body.city.should.equal('Gainesville');
        res.body.state.should.equal('Florida');
        res.body.zipcode.should.equal(33609);
        res.body.date.should.equal('Jan 1 2020');
        res.body.timefrom.should.equal('3:30');
        res.body.timeto.should.equal('5:30');
        res.body.voting.should.equal(5);
        id = res.body._id;
        done();
      });
  });

  after(function(done) {
    if(id) {
      Listing.remove({_id: id}, function(err){
        if(err) throw err;
        done();
      })
    }
    else {
        done();
    }
  });
});
