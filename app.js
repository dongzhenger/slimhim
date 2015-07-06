var app = angular.module('app', []);

app.controller('mCtrl', ['$scope', '$http',
    function ($scope, $http) {

        var desc;
        $http.get('desc.json').success(function(data) {
            desc = data;
        });

        var lastX, lastY, total = 0, base = 2400;

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
            $scope.finish = false;
            $scope.score = 0;
            $scope.totalTime = 20;
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

        document.getElementById("panel").addEventListener('touchstart', function(event) {
            lastX = event.touches[0].pageX;
            lastY = event.touches[0].pageY;
            timer($scope.totalTime);
        });

        document.getElementById("panel").addEventListener('touchmove', function(event) {
            if ($scope.finish) {
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

        function timer(time) {
            time--;
            if (time < 0) {
                $scope.$apply(function() {
                    $scope.finish = true;
                    $scope.detail = getDescribe();
                });
                $('#myModal').modal();
                return;
            }
            $scope.$apply(function() {
                $scope.totalTime = time;
            });
            setTimeout(function() {
                timer(time);
            }, 1000);
        }

        $scope.init();
    }
]);

