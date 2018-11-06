/* 1. Register the application by calling the angular module && the dependencies here */
const myFoodBaby = angular.module('myFoodBaby', ['ngRoute']);

/* 2. Configuration of our application */
myFoodBaby.config(['$routeProvider', ($routeProvider) => {
  // when user visits a specific url do something, second param is an object
  $routeProvider
    .when('/directory', {
      templateUrl: 'views/templates/directory.html'
    })
    .when('/locations', {
      templateUrl: 'views/templates/locations.html'
    })
    .when('/addFood', {
      templateUrl: 'views/templates/addFood.html'
    }).otherwise({
    // if any other page then redirect to 
    redirectTo: '/directory'
  });
}]);

/* 3. Factory for our application */
myFoodBaby.factory('Posts', ['$http', ($http) => {
  /* Different factory methods created by using the $http dependency */
  var o = {
    getData: function () {
      return $http.get('http://localhost:4000/api/posts');
    },
    createPost: function (post) {
      return $http.post('http://localhost:4000/api/posts', post);
    }
  };
  return o;
}]);

/* 4. Controller for the Food Form */
myFoodBaby.controller('FoodFormController', ['$scope', 'Posts', ($scope, Posts) => {
  function addFoodFunc() {
    // Uses the factory method to create a new post with the associated information from the $scope object newfood
    // $scope.newfood contains submitted information in an array
    Posts.createPost($scope.newfood).then(() => {
      console.log("Creating a new post");
      // First we get all the posts in the DB by the factory method getData()
      Posts.getData().then((responseData) => {
        $scope.foods = responseData.data;
      }, (err) => {
        console.log('Unable to retrieve listings:', err);
      });
    }, function (err) {
      console.log(err);
    });
    $scope.newfood = null; //initialize all the form data back to null
  }
  $scope.addFreeFood = addFoodFunc;
}]);

/* 5. Controller for the directory of free food */
myFoodBaby.controller('DirectoryController', ['$scope', 'Posts', ($scope, Posts) => {
  function getAllData() {
    Posts.getData().then((responseData) => {
      $scope.foods = responseData.data;

    }, (err) => {
      console.log("Unable to retrieve posts: ", err);
    });
  }
  getAllData(); //calls this function to initialize list with the data

}]);