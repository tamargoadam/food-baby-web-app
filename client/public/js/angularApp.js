/* 1. Register the application by calling the angular module && the dependencies here 
 * dependencies: appRoutes
 * Controller Dependencies: userControllers, mainControllers
 */
const myFoodBaby = angular.module('myFoodBaby', ['appRoutes', 'userControllers', 'mainController',
  'postControllers', 'authServices', 'postServices'
]);

/* 2. goes to routes.js that configures our routes */

// intercept all http requests, by attaching the token to the header
myFoodBaby.config(($httpProvider) => {
  $httpProvider.interceptors.push('AuthInterceptors');
});