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
    })
    .when('/signIn', {
      templateUrl: 'views/templates/signIn.html'
    })
    .when('/adminPage', {
      templateUrl: 'views/templates/adminPage.html',
      // checks if the user has permission to access this route
      access: {
        isFree: false
      }
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
      return $http.get('https://food-baby-web-app.herokuapp.com/api/posts');
      // return $http.get('http://localhost:4000/api/posts');
    },
    createPost: function (post) {
      return $http.post('https://food-baby-web-app.herokuapp.com/api/posts', post);
      //  return $http.post('http://localhost:4000/api/posts', post);
    },
    adminGetData: function () {
      return $http.get('https://food-baby-web-app.herokuapp.com/api/posts');
      //  return $http.get('http://localhost:4000/admin');
    },
    deletePost: function (id) {
      return $http.delete('https://food-baby-web-app.herokuapp.com/api/posts/' + id);
      //  return $http.delete('http://localhost:4000/api/posts/' + id);
    },
    updateVote: function (id) {
      return $http.put('https://food-baby-web-app.herokuapp.com/api/posts/' + id);
      //  return $http.put('http://localhost:4000/api/posts/' + id);
    }
  };
  return o;
}]);

/* 4. Controller for the Food Form */
myFoodBaby.controller('FoodFormController', ['$scope', 'Posts', ($scope, Posts) => {
  function addFoodFunc() {
    // Uses the factory method to create a new post with the associated information from the $scope object newfood
    // $scope.newfood contains submitted information in an array
    $scope.newfood.voting = 0;
    Posts.createPost($scope.newfood).then(() => {
      console.log("Creating a new post");
      alert("Congratulations! Your form has been submitted!");
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

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var todayDate = yyyy + '-' + mm + '-' + dd;
  $scope.date = todayDate;
  $scope.year = yyyy;

}]);

/* 5. Controller for the directory of free food */
myFoodBaby.controller('DirectoryController', ['$scope', 'Posts', ($scope, Posts) => {
  $scope.detailedInfo = undefined;
  $scope.foods = Posts;
  $scope.currentFood;

  $scope.moreInfo = function (food) {
    $scope.food = food; 
  }

  function getAllData() {
    Posts.getData().then((responseData) => {
      $scope.foods = responseData.data;

    }, (err) => {
      console.log("Unable to retrieve posts: ", err);
    });
  }
  getAllData(); //calls this function to initialize list with the data

  $scope.upVote = function (index) {
    Posts.updateVote($scope.foods[index]._id).then(() => {
      getAllData();
    }, function (error) { //else there is an error and we complete this function
      console.log(error);
    });
  }

}]);


var admin = false;
/* 6. Controller for the Navigation */
myFoodBaby.controller('NavigationController', ['$scope', '$location', ($scope, $location) => {
  $scope.isLoggedIn = function () {
    //hide all side bar navigation except logout
    return admin;
  }
  $scope.logOut = function () {
    $location.path('#!/directory');
    admin = false;
  }
}]);

/* 7. Controller for Admin Login*/
myFoodBaby.controller('LoginController', ['$scope', '$location', ($scope, $location) => {
  $scope.errmsg = "Username or password was not correct";
  var isErr = false;
  $scope.adminSignIn = function () {
    if ($scope.user.username == "admin" && $scope.user.password == "1234") {
      //go to a separate page
      admin = true;
      $location.path('/adminPage');

    } else {
      //Print that their username or password was not correct
      isErr = true;
    }
  }
  $scope.isError = function () {
    return isErr;
  }

}]);

/* 8. Controller for Admin Permissions */
myFoodBaby.controller('AdminController', ['$scope', 'Posts', ($scope, Posts) => {
  $scope.foods = Posts;

  function getAllData() {
    Posts.adminGetData().then((responseData) => {
      $scope.foods = responseData.data;

    }, (err) => {
      console.log("Unable to retrieve posts: ", err);
    });
  }
  getAllData();


  $scope.deleteListing = function (index) {
    Posts.deletePost($scope.foods[index]._id).then(function () {
      //after we delete the listing with the index and associated id, then we complete this function
      getAllData(); //this gets all the listing info again
    }, function (error) { //else there is an error and we complete this function
      console.log(error);
    });
  };


}]);