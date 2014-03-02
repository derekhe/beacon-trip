beaconTrip.controller('home_controller', function ($scope, beaconService) {

    $scope.changeMonitor = function () {
        if ($scope.settings.monitoring) {
            beaconService.stopMonitoring();
        } else {
            beaconService.startMonitoring();
        }
    };

    $scope.changeRanging = function () {
        if ($scope.settings.ranging) {
            beaconService.stopRanging();
        }
        else {
            beaconService.startRanging();
        }
    };

    $scope.isNearest = function (beacon) {
        return (beacon.major == $scope.nearestBeacon.major) && (beacon.minor == $scope.nearestBeacon.minor);
    };

    $scope.$on("serviceStarted", function () {
        $scope.$apply(function () {
            $scope.serviceStarted = true;
            $scope.settings = {ranging: true, monitoring: true, debug: true};
            $scope.regionExited = true;

        });
    });

    $scope.$on("monitoring", function (event, result) {
        $scope.$apply(function () {
            $scope.monitorResult = result;
            var event = result['event'];
            if (event === "enter") {
                $scope.regionExited = false;
            } else if (event === "exit") {
                $scope.regionExited = true;
            }
        });
    });

    $scope.$on("ranging", function (event, result) {
            $scope.$apply(function () {
                $scope.rangeResult = result;

                var beacons = JSON.parse(result['ibeacons']);
                $scope.rangeResult.ibeacons = beacons;

                var nearBeacons = _.filter(beacons, function (beacon) {
                    return beacon.proximity <= 2;
                });

                $scope.nearestBeacon = _.min(nearBeacons, function (beacon) {
                    return beacon.accuracy;
                });

                if ($scope.settings.debug) {
                    return;
                }

                if (_.isEmpty(nearBeacons)) {
                    if ($scope.regionExited) {
                        window.location.hash = "#/home";
                    }
                } else {
                    window.location.hash = "#/beacon/" + $scope.nearestBeacon.major + "/" + $scope.nearestBeacon.minor;
                }
            });
        }
    );

    document.addEventListener("deviceready", function () {
        beaconService.startService().then(function () {
            return beaconService.startMonitoring();
        }).then(function () {
            return beaconService.startRanging();
        });
    }, false);
});