beaconTrip.service("beaconService", ["$rootScope", function ($rootScope) {
    var BEACON_PLUGIN = "BeaconPlugin";

    var monitoring = function (cmd) {
        cordova.exec(function (result) {
            $rootScope.$broadcast("monitoring", result);
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
    };

    var ranging = function(cmd)
    {
        cordova.exec(function (result) {
            $rootScope.$broadcast("ranging", result);
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
    };

    return {
        startService: function ()
        {
            cordova.exec(function () {
                $rootScope.$broadcast("serviceStarted");
            }, null, BEACON_PLUGIN, "startService", []);
        },
        startMonitoring: function () {
            return monitoring("startMonitoring");
        },
        stopMonitoring: function () {
            return monitoring("stopMonitoring");
        },
        startRanging: function () {
            return ranging("startRanging");
        },
        stopRanging: function()
        {
            return ranging("stopRanging");
        }
    }
}]);
