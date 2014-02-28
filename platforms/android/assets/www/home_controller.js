beaconTrip.controller('home_controller', function ($scope, $location) {
    var BEACON_PLUGIN = "BeaconPlugin";
    $scope.settings = { monitoring: false, ranging: false};
    $scope.regionExited = true;

    $scope.changeMonitor = function () {
        var cmd = $scope.settings.monitoring ? "stopMonitoring" : "startMonitoring";

        cordova.exec(function (result) {
            $scope.monitorResult = result;
            var event = result['event'];
            if (event === "enter") {
                $scope.regionExited = false;
            } else if (event === "exit") {
                $scope.regionExited = true;
            }

            $scope.$apply();
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
    };

    $scope.changeRanging = function () {
        var cmd = $scope.settings.ranging ? "stopRanging" : "startRanging";

        cordova.exec(function (result) {
            $scope.rangeResult = result;

            var beacons = JSON.parse(result['ibeacons']);
            $scope.rangeResult.ibeacons = beacons;

            var nearBeacons = _.filter(beacons, function (beacon) {
                return beacon.proximity <= 2;
            });

            $scope.nearestBeacon = _.min(nearBeacons, function (beacon) {
                return beacon.accuracy;
            });

            if ($scope.settings.debugMode) {
                $scope.$apply();
                return;
            }

            if (_.isEmpty(nearBeacons)) {
                if ($scope.regionExited) {
                    window.location.hash = "#/home";
                }
            } else {
                window.location.hash = "#/beacon/" + $scope.nearestBeacon.major + "/" + $scope.nearestBeacon.minor;
            }

            $scope.$apply();
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
    };

    $scope.isNearest = function(beacon)
    {
        return (beacon.major == $scope.nearestBeacon.major) && (beacon.minor == $scope.nearestBeacon.minor);
    }

    $scope.startService = function () {
        cordova.exec(function () {
            $scope.serviceStarted = true;
            $scope.$apply();
        }, null, BEACON_PLUGIN, "startService", []);
    };

    document.addEventListener("deviceready", function () {
        $scope.startService();
    }, false);
});