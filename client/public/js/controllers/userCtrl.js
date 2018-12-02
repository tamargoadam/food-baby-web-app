const userCtrl = angular.module('userControllers', ['userServices']);
// dependency on the module userServices

userCtrl.controller('regCtrl', function ($location, $timeout, User) {
    var app = this;

    this.regUser = function (regData) {
        app.loading = true; 
        app.errorMsg = false;

        User.create(app.regData).then(function(data){
            if (data.data.success) {
                app.loading = false;
                //show success message
                app.successMsg = data.data.message + "...Redirecting";
                //redirect to home page
                $timeout(() => {
                    $location.path('/login');
                }, 1000);
            } else {
                app.loading = false;
                //show error message
                app.errorMsg = data.data.message;
            }
        });
    };
});


// Controller: facebookCtrl is used finalize facebook login
// userCtrl.controller('facebookCtrl', function($routeParams, Auth, $location, $window, $scope) {

//     var app = this;
//     app.errorMsg = false; // Clear errorMsg on page load
//     app.expired = false; // Clear expired on page load
//     app.disabled = true; // On page load, remove disable lock from form

//     // Check if callback was successful 
//     if ($window.location.pathname == '/facebookerror') {
//         $scope.alert = 'alert alert-danger'; // Set class for message
//         app.errorMsg = 'Facebook e-mail not found in database.'; // If error, display custom message
//     } else if ($window.location.pathname == '/facebook/inactive/error') {
//         app.expired = true; // Variable to activate "Resend Link Button"
//         $scope.alert = 'alert alert-danger'; // Set class for message
//         app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.'; // If error, display custom message
//     } else {
//         Auth.socialMedia($routeParams.token); // If no error, set the token
//         $location.path('/'); // Redirect to home page
//     }
// })