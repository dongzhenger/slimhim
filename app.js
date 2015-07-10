var app = angular.module('app', []);

app.controller('mCtrl', ['$scope', '$http',
    function ($scope, $http) {

        var desc;
        $http.get('desc.json').success(function(data) {
            desc = data;
        });
        $http.get('config.json').success(function(data) {
            $scope.config = data;
        });

        var lastX, lastY, total = 0;
        // var base = 2800, totalTime = 20;
        var base = 2800, totalTime = 15, prepareTime = 3;
        var ready, start;

        $scope.imgs = [
            "img/1.jpg",
            "img/2.jpg",
            "img/3.jpg",
            "img/4.jpg",
            "img/5.jpg",
            "img/6.jpg",
        ];

        $scope.init = function() {
            total = 0;
            start = false;
            ready = false;
            $scope.finish = false;
            $scope.score = 0;
            $scope.totalTime = totalTime;
            $scope.prepareTime = prepareTime;
            timer( prepareTime + 1, function(time) {
                if (time != $scope.prepareTime) {
                    $scope.$apply(function() {
                        $scope.prepareTime = time;
                    });
                }
            }, function() {
                $scope.$apply(function() {
                    $scope.prepareTime = -1;
                });
                ready = true;
                timer( $scope.totalTime, function(time) {
                    $scope.$apply(function() {
                        $scope.totalTime = time;
                    });
                }, function() {
                    $scope.$apply(function() {
                        $scope.finish = true;
                        $scope.detail = getDescribe();
                    });
                    $('#myModal').modal();
                });
            });
        }

        $scope.hideModal = function() {
            $('#myModal').modal('hide');
        }

        $scope.isShow = function(idx) {
            var offset = 0;
            var low = idx * idx * base - offset;
            var high = (idx+1) * (idx+1) * base + offset;
            var s = $scope.score;
            return s <= high && s >= low ||
                idx == $scope.imgs.length - 1 && s > low;
            // var level = parseInt($scope.score / 5000);
            // return level == idx || 
            //     idx == $scope.imgs.length - 1 && level > idx;
        }

        $scope.wrate = function(score) {
            return ($scope.config.rate_low + $scope.config.rate_range * Math.pow(1.1, -score / base)).toFixed(2);
        }

        $scope.weight = function(score) {
            return ($scope.config.weight_low + $scope.config.weight_range * Math.pow(1.1, -score / base)).toFixed(2);
        }

        $scope.isShare = false;

        $scope.showShare = function() {
            $scope.isShare = true;
        }
        
        $scope.hideShare = function() {
            $scope.isShare = false;
        }

        function getLevel(score) {
            return parseInt(Math.sqrt(score / base));
        }

        function getDescribe() {
            var level = getLevel($scope.score);
            if (level >= desc.length) {
                level = desc.length - 1;
            }
            return desc[level];
        }

        $('#myModal').on('hidden.bs.modal', function(event) {
            $scope.$apply(function() {
                $scope.init();
            });
        });

        document.getElementById("cover").addEventListener('touchstart', function(event) {
            event.preventDefault();
        });

        document.getElementById("cover").addEventListener('touchmove', function(event) {
            if (!ready || $scope.finish) {
                return;
            }
            if (!start) {
                start = true;
                lastX = event.touches[0].pageX;
                lastY = event.touches[0].pageY;
                return;
            }
            var x = event.touches[0].pageX;
            var y = event.touches[0].pageY;
            var absX = Math.abs(x-lastX);
            var absY = Math.abs(y-lastY);
            total += Math.sqrt(absX*absX + absY*absY);
            $scope.$apply(function() {
                $scope.score = parseInt(total);
            });
            lastX = x;
            lastY = y;
        });

        function timer(time, onTick, onEnd) {
            time--;
            if (time < 0) {
                onEnd();
                return;
            }
            onTick(time);
            setTimeout(function() {
                timer(time, onTick, onEnd);
            }, 1000);
        }

        $scope.init();
    }
]);

