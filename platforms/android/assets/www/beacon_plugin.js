beaconTrip.service("beaconService", ["$rootScope", "$q", function ($rootScope, $q) {
    var BEACON_PLUGIN = "BeaconPlugin";

    var monitoring = function (cmd) {
        var defer = $q.defer();
        cordova.exec(function (result) {
            $rootScope.$broadcast("monitoring", result);
            defer.resolve();
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
        return defer.promise;
    };

    var ranging = function(cmd)
    {
        var defer = $q.defer();
        cordova.exec(function (result) {
            $rootScope.$broadcast("ranging", result);
            defer.resolve();
        }, null, BEACON_PLUGIN, cmd, ["Region", null, null, null]);
        return defer.promise;
    };

    return {
        startService: function ()
        {
            var defer = $q.defer();
            cordova.exec(function () {
                $rootScope.$broadcast("serviceStarted");
                defer.resolve();
            }, null, BEACON_PLUGIN, "startService", []);
            return defer.promise;
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
