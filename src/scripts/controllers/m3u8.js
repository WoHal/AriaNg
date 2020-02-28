(function () {
    'use strict';

    angular.module('ariaNg').controller('M3U8Controller', ['$rootScope', '$scope', '$location', '$timeout', 'ariaNgCommonService', 'ariaNgSettingService', 'ariaNgFileService', 'aria2SettingService', 'aria2TaskService', function ($rootScope, $scope, $location, $timeout, ariaNgCommonService, ariaNgSettingService, ariaNgFileService, aria2SettingService, aria2TaskService) {
        $scope.context = {
            currentTab: 'links',
            taskType: 'urls',
            urls: '',
            uploadFile: null,
            availableOptions: (function () {
                var keys = aria2SettingService.getNewTaskOptionKeys();

                return aria2SettingService.getSpecifiedOptions(keys, {
                    disableRequired: true
                });
            })(),
            globalOptions: null,
            options: {},
            optionFilter: {
                global: true,
                http: false,
                bittorrent: false
            }
        };

        $scope.startM3U8Download = function () {
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
