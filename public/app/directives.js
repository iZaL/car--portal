angular.module('app').directive('carResults', function () {
    return {
        restrict: "EA",
        replace: true,
        scope: true,
        templateUrl: '/app/views/cars/result.html'
    }
});

angular.module('app').directive('priceSlider', function () {
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        link: function (scope, element) {
            var moved = false;
            element.ionRangeSlider({
                min: scope.slider.priceMin,
                max: scope.slider.priceMax,
                type: scope.slider.type,
                step: scope.slider.priceStep,
                postfix: scope.slider.pricePostfix,
                maxPostfix: scope.slider.maxPostfix,
                from: scope.filters.priceFrom,
                to: scope.filters.priceTo,
                force_edges:scope.slider.forceEdges,
                grid: scope.slider.grid,
                grid_num: scope.slider.gridNum,
                grid_margin:scope.slider.gridMargin,
                keyboard:scope.slider.keyboard,
                onChange: function (obj) { // callback, is called on every change
                    moved = true;
                    _.defer(function () {
                        scope.$apply();
                    });
                },
                onFinish: function (obj) { // callback, is called once, after slider finished it's work
                    scope.filters.priceFrom = obj.fromNumber;
                    scope.filters.priceTo = obj.toNumber;
                    scope.resetValues();
                    scope.getCars();
                }
            });

        }
    }
});

angular.module('app').directive('mileageSlider', function () {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, element) {
            var moved = false;
            element.ionRangeSlider({
                min: scope.slider.mileageMin,
                max: scope.slider.mileageMax,
                type: scope.slider.type,
                step: scope.slider.mileageStep,
                postfix: scope.slider.mileagePostfix,
                maxPostfix: scope.slider.maxPostfix,
                minPostfix: scope.slider.minPostfix,
                from: scope.filters.mileageFrom,
                to: scope.filters.mileageTo,
                force_edges:scope.slider.forceEdges,
                grid: scope.slider.grid,
                grid_num: scope.slider.gridNum,
                grid_margin:scope.slider.gridMargin,
                keyboard:scope.slider.keyboard,
                onChange: function (obj) { // callback, is called on every change
                    moved = true;
                    scope.filters.mileageFrom = obj.fromNumber;
                    scope.filters.mileageTo = obj.toNumber;
                    _.defer(function () {
                        scope.$apply();
                    });
                },
                onFinish: function (obj) { // callback, is called once, after slider finished it's work
                    //scope.resetValues();
                    scope.getCars();
                }
            });

        }
    }
});

angular.module('app').directive('yearSlider', function () {
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        link: function (scope, element) {
            var moved = false;
            element.ionRangeSlider({
                min: scope.slider.yearMin,
                max: scope.slider.yearMax,
                type: scope.slider.type,
                step: scope.slider.yearStep,
                maxPostfix: scope.slider.maxPostfix,
                from: scope.filters.yearFrom,
                to: scope.filters.yearTo,
                force_edges:scope.slider.forceEdges,
                grid: scope.slider.grid,
                grid_num: scope.slider.gridNum,
                grid_margin:scope.slider.gridMargin,
                keyboard:scope.slider.keyboard,
                onChange: function (obj) { // callback, is called on every change
                    moved = true;
                    _.defer(function () {
                        scope.$apply();
                    });
                },
                onFinish: function (obj) { // callback, is called once, after slider finished it's work
                    scope.resetValues();
                    scope.filters.yearFrom = obj.fromNumber;
                    scope.filters.yearTo = obj.toNumber;
                    scope.getCars();
                }
            });

        }
    }
});

angular.module('app').directive('favoriteTpl', favoriteTpl);

favoriteTpl.$inject = ['FavoriteService'];

function favoriteTpl(FavoriteService) {
    return {
        restrict: 'EA',
        templateUrl: '/app/views/partials/favorite-tpl.html',
        scope: {
            favoreableType: '@',
            favoreableId: '@',
            favorite: '='
        },
        link: function link(scope) {
            // format of scope.favorite = { id: 1, user_id: 1, favoriteable_id: 30, favoriteable_type: "Car", created_at: "2015-02-13 09:38:20", updated_at: "2015-02-13 09:38:20", deleted_at: null }
            if (typeof scope.favorite != 'object') {
                return false;
            }
            scope.save = function () {
                var postData = {
                    "favoriteable_id": scope.favoreableId,
                    "favoriteable_type": scope.favoreableType
                };
                var response = FavoriteService.save(postData);
                scope.favorite = response;
            };

            scope.destroy = function () {
                FavoriteService.destroy(scope.favorite).then(function (data) {
                    scope.favorite = null;
                });
            };
        }
    };
}

angular.module('app').directive('favoritePanel', favoritePanel);

favoritePanel.$inject = ['FavoriteService'];

function favoritePanel(FavoriteService) {

    return {
        restrict: 'EA',
        templateUrl: '/app/views/partials/favorite-panel.html',
        link: function (scope) {
            scope.destroy = function (favorite) {
                FavoriteService.destroy(favorite).then(function (result) {
                    //element.fadeOut(1000);
                });
            };
        }
    }

}
