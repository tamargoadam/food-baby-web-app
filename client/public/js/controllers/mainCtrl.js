const mainCtrl = angular.module('mainController', ['authServices']);

//pass in factory to the controller that authenticates a user logining in
mainCtrl.controller('mainCtrl', function (Auth, $location, $timeout, $rootScope) {
    var app = this;
    app.loadme = false; // hide html until this becomes true
    // Will run code every time a route changes
    $rootScope.$on('$routeChangeStart', function () {
        // if it is true that the user is logged in
        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function (data) {
                app.username = data.data.username;
                app.useremail = data.data.email;
                app.loadme = true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }
    });


    this.doLogin = function (loginData) {
        app.loading = true;
        app.errorMsg = false;

        Auth.login(app.loginData).then(function (data) {
            if (data.data.success) {
                app.loading = false;
                //show success message
                app.successMsg = data.data.message + "...Redirecting";
                //redirect to home page
                $timeout(() => {
                    $location.path('/');
                    app.loginData = '';
                    app.successMsg = false;
                }, 1000);

            } else {
                app.loading = false;
                //show error message
                app.errorMsg = data.data.message;
            }
        });
    };

    this.logout = function () {
        Auth.logout();
        // redirect user
        $location.path('/logout');
        $timeout(() => {
            $location.path('/');
        }, 2000);

    };

});