angular.module('beaconTrip', ['ionic'])
    .controller('mainController', function ($scope) {
        var BEACON_PLUGIN = "BeaconPlugin";
        $scope.status = { monitoring : false, ranging: false};

        $scope.changeMonitor = function () {
            var cmd = $scope.status.monitoring ? "stopMonitoring" : "startMonitoring";

            cordova.exec(function (result) {
                $scope.monitorResult = result;
                $scope.$apply();
            }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
        };

        $scope.changeRanging = function () {
            var cmd = $scope.status.ranging ? "stopRanging" : "startRanging";

            cordova.exec(function (result) {
                $scope.rangeResult = result;
                $scope.$apply();
            }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
        }

        document.addEventListener("deviceready", function () {
            cordova.exec(function () {
                $scope.serviceStarted = true;
                $scope.$apply();
            }, null, BEACON_PLUGIN, "startService", []);

        }, false);

    });