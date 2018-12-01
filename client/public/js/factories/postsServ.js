/**
 * Post Factorys
 * for when creating and getting posts from DB
 */
const postServ = angular.module('postServices', []);

postServ.factory('Posts', ['$http', ($http) => {
  /* Different factory methods created by using the $http dependency */
  var o = {
    getData: function () {
      // return $http.get('https://food-baby-web-app.herokuapp.com/api/posts');
      return $http.get('api/posts');
    }, 
    createPost: function (post) {
      // return $http.post('https://food-baby-web-app.herokuapp.com/api/posts', post);
      return $http.post('/api/posts', post);
    },
    // adminGetData: function () {
    //   // return $http.get('https://food-baby-web-app.herokuapp.com/api/posts');
    //   return $http.get('http://localhost:4000/admin');
    // },
    deletePost: function (id) {
      // return $http.delete('https://food-baby-web-app.herokuapp.com/api/posts/' + id);
      return $http.delete('/api/posts/' + id);
    }
    // updateVote: function (id) {
    //   // return $http.put('https://food-baby-web-app.herokuapp.com/api/posts/' + id);
    //   return $http.post('/api/posts/' + id);
    // }
  };
  return o; 
}]);