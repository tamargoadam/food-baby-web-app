angular.module('listings').factory('Listings', function() {
    var listings = {
      entries : [
        {
            "organization": "ACE", 
            "name": "Fall 2018 GBM #3", 
            "type": "pizza",
            "address": "MAT 0018",
            "date": "2018-11-01T18:15:00",
            //Thursday, Nov 1, 2018, at 6:15 PM
            "description": "come out to ACE's first GBM of the semester!"
        }, 
        {
            "organization": "ACM", 
            "name": "UF ACM Halloween Social - Fall 2018",
            "type": "chipotle",
            "address": "CSE E220",
            "date": "2018-10-29T18:35:00",
            //Monday, October 29, 2018, at 6:35 PM
            "description": "BOO! FREE FOOD. MOVIES & FUN. See you there."
        }, 
        {
            "organization": "OSC", 
            "name": "Open Source Club GBM #5",
            "type": "pizza",
            "address": "Reitz Union 2325",
            "date": "2018-10-24T17:00:00",
            //Wednesday, October 24, 2018, at 5 PM
            "description": "Server Orientation/Docker"
        }]
      };
        return listings.entries;
}); 