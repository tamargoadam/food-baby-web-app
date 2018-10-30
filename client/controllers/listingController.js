angular.module('listings').controller('ListingsController', ['$scope', 'Listings', 
  function($scope, Listings) {
    $scope.listings = Listings;
    $scope.detailedInfo = undefined;
    $scope.showDetails = function(listings) {
		var listingNumber = $scope.listings.indexOf(listings);
		if ($scope.listings[listingNumber].address == undefined) {									//if address and coordinates don't exist, just don't print them
		$scope.detailedInfo = "Listing Number = " + listingNumber + "<br>" 
							+ "Listing Organization = " + $scope.listings[listingNumber].organization + "<br>"  
							+ "Listing Name = " + $scope.listings[listingNumber].name;
		}
		else {																						//otherwise, print everything
		$scope.detailedInfo = "Listing Number = " + listingNumber + "<br>" 
                            + "Listing Organization = " + $scope.listings[listingNumber].organization + "<br>"  
                            + "Listing Name = " + $scope.listings[listingNumber].name + "<br>"
                            + "Listing Type = " + $scope.listings[listingNumber].type + "<br>"
                            + "Listing Date = " + $scope.listings[listingNumber].date + "<br>"
                            + "Listing Address = " + $scope.listings[listingNumber].address + "<br>"
                            + "Description: " + $scope.listings[listingNumber].description;
		}
		console.log($scope.detailedInfo);
		document.getElementById("moreDetails").innerHTML = $scope.detailedInfo;
	};
  }
]);