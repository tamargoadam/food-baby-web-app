const myRoutes = angular.module('appRoutes', ['ngRoute']);

/*2. Configuration of our application */
myRoutes.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    // when user visits a specific url do something, second param is an object
    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/templates/home.html'
        })
        // user registration page
        .when('/register', {
            templateUrl: 'views/templates/users/register.html',
            controller: 'regCtrl',
            controllerAs: 'register'
        })
        // user login page
        .when('/login', {
            templateUrl: 'views/templates/users/login.html'
        })
        // user login page
        .when('/logout', {
            templateUrl: 'views/templates/users/logout.html'
        })
        // user profile
        .when('/profile', {
            templateUrl: 'views/templates/users/profile.html'
        })
        .when('/facebook/:token', {
            templateUrl: 'views/templates/users/social.html'
        })

        // food listing page
        .when('/directory', {
            templateUrl: 'views/templates/directory.html',
            controller: "DirectoryController"
        })
        // map page
        .when('/locations', {
            templateUrl: 'views/templates/locations.html',
            controller: "MapCtrl"
        })
        // add food form
        .when('/addFood', {
            templateUrl: 'views/templates/addFood.html',
            controller: "FoodFormController"
        })
        // // admin sign in page
        // .when('/signIn', {
        //     templateUrl: 'views/templates/signIn.html'
        // })
        // food on campus (tweets)
        .when('/foodOnCampus', {
            templateUrl: 'views/templates/foodTweets.html'
        })
        // .when('/adminPage', {
        //     templateUrl: 'views/templates/adminPage.html',
        // })
        .otherwise({
            // if any other page then redirect to 
            redirectTo: '/'
        });
    // Required to remove AngularJS hash from URL (no base is required in index file)   
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);