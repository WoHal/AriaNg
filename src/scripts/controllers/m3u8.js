(function () {
    'use strict';

    angular.module('ariaNg').controller('M3U8Controller', ['$rootScope', '$scope', '$timeout', 'ariaNgFileService', 'aria2TaskService', 'aria2SettingService', function ($rootScope, $scope, $timeout, ariaNgFileService, aria2TaskService, aria2SettingService) {
        $scope.context = {
            filename: '',
            urls: '',
            // 全局设置
            globalOptions: {
                dir: ''
            },
            options: {}
        };

        $rootScope.loadPromise = (function () {
            return aria2SettingService.getGlobalOption(function (response) {
                if (response.success) {
                    $scope.context.globalOptions = response.data;
                }
            });
        })();

        $scope.startM3U8Download = function (pauseOnAdded) {
            var tasks = [];
            var url = $scope.context.urls.trim();
            var a = document.createElement('a');
            a.href = url;
            $.ajax({
                type: 'GET',
                dataType: 'text',
                url: url,
                success: function(res) {
                    var parser = new m3u8Parser.Parser();
                    parser.push(res);
                    parser.end();

                    var playlists = parser.manifest.playlists || [];
                    playlists.forEach(function(playlist) {
                        $.ajax({
                            type: 'GET',
                            dataType: 'text',
                            url: a.origin + playlist.uri,
                            success: function(list) {
                                parser = new window.m3u8Parser.Parser();
                                parser.push(list);
                                parser.end();

                                var segments = parser.manifest.segments;
                                parser = null;
                                var tsFiles = [];
                                segments.forEach(function(segment) {
                                    tsFiles.push(segment.uri.match(/\/([^/.]+\.ts)$/)[1]);
                                    tasks.push({
                                        urls: [a.origin + segment.uri],
                                        options: {
                                            dir: $scope.context.globalOptions.dir + '/' + $scope.context.filename
                                        }
                                    });
                                });

                                aria2TaskService.newUriTasks(tasks, pauseOnAdded);
                            }
                        });
                    });
                }
            });
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
