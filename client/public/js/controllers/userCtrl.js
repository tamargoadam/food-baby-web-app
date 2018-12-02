const userCtrl = angular.module('userControllers', ['userServices']);
// dependency on the module userServices

userCtrl.controller('regCtrl', function ($location, $timeout, User) {
    var app = this;

    this.regUser = function (regData) {
        app.loading = true;
        app.errorMsg = false;

        User.create(app.regData).then((data) => {
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