/**
 * Authentication Factory
 * for authenticating the user
 */
const authServ = angular.module('authServices', []);

authServ.factory('Auth', function ($http, AuthToken) {
    // Create the authFactory object
    var authFactory = {
        // Loging in the user
        login: function (loginData) {
            return $http.post('/api/authenticate', loginData).then((data) => {
                AuthToken.setToken(data.data.token);
                return data;
            });
        },
        isLoggedIn: function () {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        },
        logout: function () {
            AuthToken.setToken();
        },
        //get users data
        getUser: function () {
            // Check first if user has a token
            if (AuthToken.getToken()) {
                return $http.post('/api/me'); // Return user's data
            } else {
                $q.reject({
                    message: 'User has no token'
                }); // Reject if no token exists
            }
        }
    }

    return authFactory;
});

authServ.factory('AuthToken', function ($window) {
    var authTokenFactory = {
        // when invoke, save to local storage of the browser
        setToken: function (token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }

        },
        // AuthToken.getToken();
        getToken: function () {
            // reach into local storage and get that token
            return $window.localStorage.getItem('token');
        }
    };
    return authTokenFactory;
});

// AuthInterceptors is used to configure headers with token (passed into config, angularApp.js file)
authServ.factory('AuthInterceptors', function (AuthToken) {
    var authInterceptorsFactory = {
        // Function to check for token in local storage and attach to header if so
        request: function (config) {
            var token = AuthToken.getToken();  // Check if a token is in local storage
            
            if (token) { //If exists, attach to headers
                config.headers['x-access-token'] = token;
            }
            return config; // Return config object for use in angularApp.js (config file)
        }
    };
    return authInterceptorsFactory
});