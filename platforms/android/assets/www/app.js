var beaconTrip = angular.module('beaconTrip', ['ionic']);

beaconTrip.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "home.html"
        })
        .state('beacon-1-2', {
            url: "/beacon/1/2",
            templateUrl: "beacons/beacon-1-2.html"
        })
        .state('beacon-1-3', {
            url: "/beacon/1/3",
            templateUrl: "beacons/beacon-1-3.html"
        });

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");
});
