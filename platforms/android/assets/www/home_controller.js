beaconTrip.controller('home_controller', function ($scope, $location) {
    var BEACON_PLUGIN = "BeaconPlugin";
    $scope.status = { monitoring: false, ranging: false};
    $scope.regionExited = false;

    $scope.changeMonitor = function () {
        var cmd = $scope.status.monitoring ? "stopMonitoring" : "startMonitoring";

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
        var cmd = $scope.status.ranging ? "stopRanging" : "startRanging";

        cordova.exec(function (result) {
            $scope.rangeResult = result;

            var beacons = JSON.parse(result['ibeacons']);
            var nearBeacons = _.filter(beacons, function (beacon) {
                return beacon.accuracy < 3;
            });

            var nearestBeacon = _.min(nearBeacons, function (beacon) {
                return beacon.accuracy;
            });

            if (_.isEmpty(nearBeacons)) {
                if ($scope.regionExited) {
                    window.location.hash = "#/home";
                }
            } else {
                window.location.hash = "#/beacon/" + nearestBeacon.major + "/" + nearestBeacon.minor;
            }

            $scope.$apply();
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
    };

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