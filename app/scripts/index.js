'use strict';
/*global $:false */

var taurusSiteApp = angular.module('taurusSiteApp', ['ui.bootstrap', 'ngSanitize', 'ui.router', 'ngMaterial', 'hm.readmore']);

taurusSiteApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/movie');

    $stateProvider

        .state('movie', {
            url: '/movie',
            templateUrl: 'templates/movie_search_result.html'
        })
        .state('movie.detail', {
            url: '/{movieId:[0-9]{1,8}}',
            templateUrl: 'templates/movie_detail.html',
            resolve: {
                movieDetails: function ($http, $stateParams) {
                    return $http({
                            method: 'GET',
                            url: '/api/movie/1.0/' + $stateParams.movieId
                        })
                        .then(function (data) {
                            return data.data;
                        });
                }
            },
            controller: function ($scope, movieDetails) {
                $scope.movieDetails = movieDetails;
            }
        })
        .state('celebrity', {
            url: '/celebrity',
            templateUrl: 'templates/celebrity_search_result.html'
        })
        .state('celebrity.detail', {
            url: '/{celebityId:[0-9]{1,8}}',
            templateUrl: 'templates/celebrity_detail.html',
            resolve: {
                celebrityDetails: function ($http, $stateParams) {
                    return $http({
                            method: 'GET',
                            url: '/api/celebrity/1.0/' + $stateParams.celebityId
                        })
                        .then(function (data) {
                            return data.data;
                        });
                }
            },
            controller: function ($scope, celebrityDetails) {
                $scope.celebrityDetails = celebrityDetails;
            }
        });

});

taurusSiteApp.controller('inputGroupController', function ($scope, $http, $state) {
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (toState.name.startsWith('celebrity')) {
            $scope.condition.searchType = 'Celebrity';
        } else if (toState.name.startsWith('movie')) {
            $scope.condition.searchType = 'Movie';
        }
    });

    $scope.defaultImage = 'https://d2a5cgar23scu2.cloudfront.net/static/images/redesign/actor.default.tmb.gif';
    $scope.data = {};
    $scope.searchTypeItems = ['Movie', 'Celebrity'];
    $scope.dropboxItemSelected = function ($event, item) {
        $event.preventDefault();
        $scope.condition.searchType = item;
        $scope.condition.currentPage = 1;
        $scope.data = {};

        $scope.clickSearch();

    };

    $scope.condition = {
        searchType: $scope.searchTypeItems[0],
        text: '',
        currentPage: 1
    };

    $scope.clickSearch = function () {
        $scope.condition.currentPage = 1;
        $scope.searchRequest();
        switch ($scope.condition.searchType) {
            case 'Movie':
                $state.go('movie');
                break;
            case 'Celebrity':
                $state.go('celebrity');
                break;
            default:
        }

    };

    $scope.searchRequest = function () {
        if (!$scope.condition.text) {
            $scope.data = {};
            return;
        }
        var url = '';
        switch ($scope.condition.searchType) {
            case 'Movie':
                url = '/api/search/1.0/movies?q=' + $scope.condition.text + '&page=' + ($scope.condition.currentPage - 1);
                break;
            case 'Celebrity':
                url = '/api/search/1.0/celebrities?q=' + $scope.condition.text + '&page=' + ($scope.condition.currentPage - 1);
                break;
            default:
                console.log('generate url error!');
        }
        $http.get(url)
            .success(function (data) {
                $scope.data = data;
                $scope.condition.currentPage = $scope.data.number + 1;
            })
            .error(function () {
                console.log('calling api error.');
            })
            .finally(function () {
                //                console.log('finish calling api');
            });
    };
    $scope.checkIfEnterClicked = function ($event) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            $scope.clickSearch();
        }
    };
    $scope.pageChanged = function () {
        $scope.searchRequest();
    };

});

taurusSiteApp.controller('celebrityDetailController', function ($scope) {
    $scope.orderByField = 'movieYear';
    $scope.reverseSort = true;
});