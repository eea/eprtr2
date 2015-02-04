myApp.controller('HeaderController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.url();
    }
});



