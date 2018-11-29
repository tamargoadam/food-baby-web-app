/* Require statements */
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
  organization: {
    type: String,
    description: "Must be a string and is required",
    required: true
  },
  eventname: {
    type: String,
    description: "Must be a string and is required",
    required: true
  },
  typeoffood: {
    type: String,
    description: "Must be a string (pick from dropdown menu) and is required",
    required: true
  },
  vegetarian:{
    type: Boolean
  },
  vegan: {
    type: Boolean
  },
  building: {
    type: String,
    description: "Must be a string and is required"
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    long: {
      type: Number,
      required: true
    }
  },
  address: {
    type: String,
    required: true,
    description: "Must be a string and is required"
  },
  city: {
    type: String,
    required: true,
    description: "Must be a string and is required"
  },
  state: {
    type: String,
    required: true,
    description: "Must be a string and is required"
  },
  zipcode: {
    type: Number,
    required: true,
    description: "Must be a number and is required"
  },
  date: {
    type: String,
    required: true
  },
  timefrom: {
    type: String,
    description: "must be a time and be less than timeTo and is required",
    required: true
  },
  timeto: {
    type: String,
    description: "must be a time and be greater than timeFrom and is required",
    required: true
  },
  voting: {
    type: Number
  }
});

/** Exporting the model makes it available to other part of our Node app */
module.exports = mongoose.model('Post', schema);
