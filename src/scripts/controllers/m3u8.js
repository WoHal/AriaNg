(function () {
    'use strict';

    angular.module('ariaNg').controller('M3U8Controller', ['$rootScope', '$scope', '$location', '$timeout', 'ariaNgCommonService', 'ariaNgSettingService', 'ariaNgFileService', 'aria2SettingService', 'aria2TaskService', function ($rootScope, $scope, $location, $timeout, ariaNgCommonService, ariaNgSettingService, ariaNgFileService, aria2SettingService, aria2TaskService) {
        $scope.context = {
            urls: '',
            globalOptions: null,
            options: {}
        };

        $scope.loadDefaultOption = function () {
            if ($scope.context.globalOptions) {
                return;
            }

            $rootScope.loadPromise = aria2SettingService.getGlobalOption(function (response) {
                if (response.success) {
                    $scope.context.globalOptions = response.data;
                }
            });
        };

        $scope.startM3U8Download = function () {
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
