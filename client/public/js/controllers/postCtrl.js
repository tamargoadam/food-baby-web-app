const postCtrl = angular.module('postControllers', ['postServices']);
// dependency on the module postServices because needs to use the factory from it

/* 1. Controller for the Food Form */
postCtrl.controller('FoodFormController', function ($scope, Posts) {
  $scope.submitMsg = "Congratulations! Your form has been submitted!";
  var isSuccess = false;

  function addFoodFunc() {
    // Uses the factory method to create a new post with the associated information from the $scope object newfood
    // $scope.newfood contains submitted information in an array
    $scope.newfood.voting = 0;
    Posts.createPost($scope.newfood).then(() => {
      isSuccess = true;
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

  $scope.submitSuccess = function () {
    return isSuccess;
  }

});

/* 5. Controller for the directory of free food */
postCtrl.controller('DirectoryController', function ($scope, Posts) {
  $scope.detailedInfo = undefined;
  $scope.foods = Posts;
  $scope.currentFood;

  $scope.moreInfo = function (food) {
    $scope.food = food;
  }

  function getAllData() {
    Posts.getData().then(function (responseData) {
      $scope.foods = responseData.data;

    }, (err) => {
      console.log("Unable to retrieve posts: ", err);
    });
  }
  getAllData(); //calls this function to initialize list with the data

  // $scope.upVote = function (index) {
  //   Posts.updateVote($scope.foods[index]._id).then(() => {
  //     getAllData();
  //   }, function (error) { //else there is an error and we complete this function
  //     console.log(error);
  //   });
  // }

});

postCtrl.filter("dateFilter", function () {
  return function (items, from, to) {
    var result = [];

    for (var i = 0; i < items.length; i++) {
      var eventDate = new Date(items[i].date.substr(0, 4), items[i].date.substr(5, 2) - 1, items[i].date.substr(8, 2));
      if (eventDate >= from && eventDate <= to) result.push(items[i]);
    }

    if (from && to) return result;
    else return items;
  }
})

/* 7. Map Controller */
postCtrl.controller('MapCtrl', function ($scope, Posts) {
  var mapOptions = {
    center: {
      lat: 29.6463,
      lng: -82.3478
    },
    zoom: 15
  }
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var geocoder = new google.maps.Geocoder();

  $scope.markers = [];
  var infoWindow;

  function getAllData() {
    Posts.getData().then(function (responseData) {
      for (var i = 0; i < responseData.data.length; i++) {
        // console.log(responseData.data[0].address);
        generatePin(geocoder, $scope.map, responseData.data[i]);
      }
    }, (err) => {
      console.log("Unable to retrieve posts: ", err);
    });
  }
  getAllData(); //calls this function to initialize list with the data

  function generatePin(geocoder, map, Posts) {
    geocoder.geocode({
      'address': Posts.city + " " + Posts.address
    }, function (results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });

        marker.addListener('click', function () {
          if (infoWindow) {
            infoWindow.close();
          }
          infoWindow = new google.maps.InfoWindow;
          infoWindow.setPosition(marker.getPosition());
          infoWindow.setContent(Posts.eventname + "<br>" + Posts.organization + "<br>" + Posts.address +
            "<br>" + Posts.date + "<br>" + Posts.timefrom + " - " + Posts.timeto);
          infoWindow.open(map, marker);
          // map.setCenter(marker.getPosition());
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

});



// var admin = false;
// /* 6. Controller for the Navigation */
// myFoodBaby.controller('NavigationController', ['$scope', '$location', ($scope, $location) => {
//   $scope.isLoggedIn = function () {
//     //hide all side bar navigation except logout
//     return admin;
//   }
//   $scope.logOut = function () {
//     $location.path('#!/directory');
//     admin = false;
//   }
// }]);

// /* 7. Controller for Admin Login*/
// myFoodBaby.controller('LoginController', ['$scope', '$location', ($scope, $location) => {
//   $scope.errmsg = "Username or password was not correct";
//   var isErr = false;
//   $scope.adminSignIn = function () {
//     if ($scope.user.username == "admin" && $scope.user.password == "1234") {
//       //go to a separate page
//       admin = true;
//       $location.path('/adminPage');

//     } else {
//       //Print that their username or password was not correct
//       isErr = true;
//     }
//   }
//   $scope.isError = function () {
//     return isErr;
//   }

// }]);

// /* 8. Controller for Admin Permissions */
// myFoodBaby.controller('AdminController', ['$scope', 'Posts', ($scope, Posts) => {
//   $scope.foods = Posts;

//   function getAllData() {
//     Posts.adminGetData().then((responseData) => {
//       $scope.foods = responseData.data;

//     }, (err) => {
//       console.log("Unable to retrieve posts: ", err);
//     });
//   }
//   getAllData();


//   $scope.deleteListing = function (index) {
//     Posts.deletePost($scope.foods[index]._id).then(function () {
//       //after we delete the listing with the index and associated id, then we complete this function
//       getAllData(); //this gets all the listing info again
//     }, function (error) { //else there is an error and we complete this function
//       console.log(error);
//     });
//   };


// }]);