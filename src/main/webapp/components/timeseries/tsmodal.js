'use strict';

var ModalTimeSeriesCtrl = function ($scope, $modalInstance, isoContType, isoQP) {
	  $scope.isoContType = isoContType;
	  $scope.isoQP = isoQP;
	  $scope.ok = function () {
	    $modalInstance.close();
	  };

	 /* $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };*/
};
