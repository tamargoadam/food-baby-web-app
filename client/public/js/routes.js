var myRoutes = angular.module('appRoutes', ['ngRoute']);

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
            controllerAs: 'register',
            authenticated: false
        })
        // user login page
        .when('/login', {
            templateUrl: 'views/templates/users/login.html',
            authenticated: false
        })
        // user login page
        .when('/logout', {
            templateUrl: 'views/templates/users/logout.html',
            authenticated: true
        })
        // user profile
        .when('/profile', {
            templateUrl: 'views/templates/users/profile.html',
            authenticated: true
        })
        // Facebook
        .when('/facebook/:token', {
            templateUrl: 'views/templates/users/social.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook'
            // authenticated: false
        })
        // Route: Facebook Error
        .when('/facebookerror', {
            templateUrl: 'app/views/pages/users/login.html',
            controller: 'facebookCtrl',
            controllerAs: 'facebook',
            // authenticated: false
        })
        // food listing page
        .when('/directory', {
            templateUrl: 'views/templates/directory.html',
            controller: "DirectoryController",
            authenticated: true
        })
        // map page
        .when('/locations', {
            templateUrl: 'views/templates/locations.html',
            controller: "MapCtrl",
            authenticated: true
        })
        // add food form
        .when('/addFood', {
            templateUrl: 'views/templates/addFood.html',
            controller: "FoodFormController",
            authenticated: true
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

myRoutes.run(['$rootScope', 'Auth', '$location', 'User', function ($rootScope, Auth, $location, User) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // Only perform if user visited a route listed above
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if (next.$$route.authenticated === true) {
                // Check if authentication is required, then if permission is required
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                    // } else if (next.$$route.permission) {
                    //     // Function: Get current user's permission to see if authorized on route
                    //     User.getPermission().then(function(data) {
                    //         // Check if user's permission matches at least one in the array
                    //         if (next.$$route.permission[0] !== data.data.permission) {
                    //             if (next.$$route.permission[1] !== data.data.permission) {
                    //                 event.preventDefault(); // If at least one role does not match, prevent accessing route
                    //                 $location.path('/'); // Redirect to home instead
                    //             }
                    //         }
                    //     });
                }
            } else if (next.$$route.authenticated === false) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }



    });


}]);