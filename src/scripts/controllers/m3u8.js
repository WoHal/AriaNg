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

        // var aElement;
        // function getDownloadURL() {
        //     if (aElement) {
        //         return aElement;
        //     }
        //     aElement = document.createElement('a');
        //     aElement.href = $scope.context.urls.trim();
        //     return aElement;
        // }
        // function getPath(pathname, uri) {
        //     var isAbsolutePath = uri.startsWith('/');
        //     return isAbsolutePath ? uri : pathname.replace(/[^/.]+\.ts/i, uri);
        // }
        function getSegments(url, successCb) {
            $.ajax({
                type: 'GET',
                dataType: 'text',
                url: url,
                success: function(res) {
                    var parser = new m3u8Parser.Parser();
                    parser.push(res);
                    parser.end();

                    var playlist = parser.manifest.playlists && parser.manifest.playlists[0];
                    var segments = parser.manifest.segments;
                    parser = null;

                    if (playlist) {
                        getSegments(new URL(playlist.uri, url).href, successCb);
                    } else if (segments.length > 0) {
                        successCb(url, segments);
                    }
                }
            });
        }

        $scope.startM3U8Download = function (pauseOnAdded) {
            var tasks = [];
            getSegments($scope.context.urls.trim(), function(url, segments) {
                var tsFiles = [];
                segments.forEach(function(segment) {
                    var tsUrl = new URL(segment.uri, url).href;
                    tsFiles.push('file ' + tsUrl.match(/\/([^/.]+\.ts)$/)[1]);
                    tasks.push({
                        urls: [tsUrl],
                        options: {
                            dir: $scope.context.globalOptions.dir + '/' + $scope.context.filename
                        }
                    });
                });

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:9001/saveFile',
                    contentType: 'application/json',
                    data: JSON.stringify([{
                        path: $scope.context.globalOptions.dir + '/' + $scope.context.filename + '/playlist.txt',
                        content: tsFiles.join('\n')
                    }, {
                        path: $scope.context.globalOptions.dir + '/' + $scope.context.filename + '/convert.sh',
                        content: 'ffmpeg -f concat -safe 0 -i playlist.txt -c copy index.mp4 && rm -f *.ts'
                    }])
                });

                aria2TaskService.newUriTasks(tasks, pauseOnAdded);
            });
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
