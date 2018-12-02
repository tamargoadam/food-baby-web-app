/**
 * Factory created for custom functions
 * like registering
 */

const userServ = angular.module('userServices', []);

userServ.factory('User', function ($http) {
  // Create the userFactory object
  var userFactory = {
    // Register users in database - passes in user registration data
    create: function (regData) {
      return $http.post('/api/users', regData);
    }
  };
  return userFactory;
});