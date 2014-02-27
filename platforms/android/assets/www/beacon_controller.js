beaconTrip.controller('beacon_controller', function($scope, $stateParams)
{
    $scope.uuid = $stateParams.uuid;
    $scope.major = $stateParams.major;
    $scope.minor = $stateParams.minor;
});