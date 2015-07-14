// Main JS should go here!
// Include scripts using Browserify by doing:
// var $ = require('jquery');

var angular = require('angular');
var ngSanitize = require('angular-sanitize');

var inWords = require('in-words').en;

var personasApp = angular.module('personasApp',[ngSanitize]);


personasApp.controller('AppController', ['$scope', function($scope) {
    $scope.about = "";
    $scope.techUnderstanding = 50;
    $scope.tryingToDo = "";
    $scope.whyAmITrying = "";
    $scope.whatDoINeed = "";
    $scope.whenDoIWant = "";
    $scope.siteUsage = "";
    $scope.devices = [{
        name: '',
        image: ''
    }];

    $scope.faces = [
        "http://www.placecage.com/c/500/500",
        "http://www.placecage.com/g/500/500",
        "http://www.placecage.com/500/500",
        "/images/bledsoe.jpg"
    ]
}]);

personasApp.directive('imageSelect', function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        scope: {
            images : '=images',
            selectedImage: '=selectedImage'
        },
        template: `
        <div class="c-image-select" ng-click="toggleSelection()">
            <div class="c-image-select__selected-image" style="background-image:url('{{selectedImage}}');"></div>
            <ul ng-hide="!selectionVisible" class="c-image-select__list">
                <li ng-repeat="image in images" class="c-image-select__list-item" ng-click="imageSelected(image)"><div style="background-image: url('{{image}}');" class="c-image-select__image"></div></li>
            </ul>
        </div>
        `,
        link: function(scope, element, attributes, ngModel) {
            scope.selectionVisible = false;
            scope.toggleSelection = function() {
                scope.selectionVisible = !scope.selectionVisible;
            }

            scope.imageSelected = function(image) {
                ngModel.$setViewValue(image);
                scope.selectedImage = image;
            }
        }

    }
});

personasApp.directive('deviceUsage', function() {
    return {
        restrict: 'E',
        scope: {
            devices: '=devices'
        },
        template: `
        <div class="c-devices">
            <header class="c-devices__header">
                <h2 class="c-configuration__label c-configuration__label--big c-devices__label">Device</h2>
                <div ng-click="addDevice()" class="c-devices__add" >+</div>
            </header>

            <ul class="c-devices__list">
                <li ng-repeat="device in devices" class="c-devices__list-item">
                    <image-select images="deviceImages" class="c-devices__image-select" ng-model="device.image"></image-select>
                    <input class="c-devices__name" ng-model="device.name">
                    <div class="c-devices__delete" ng-click="delete($index)">X</div>
                </li>
            </ul>
        </div>
        `,
        link: function(scope, element, attributes) {
            scope.deviceImages = [
                "/images/phone.svg",
                "/images/tablet.svg",
                "/images/laptop.svg"
            ]

            scope.addDevice = function() {
                scope.devices.push({
                    name: '',
                    icon: ''
                });
            }

            scope.delete = function(index) {
                scope.devices.splice(index, 1);
            }
        }

    }
});

personasApp.filter('nl2p', function () {
    return function(text){
        text = String(text).trim();
        return (text.length > 0 ? '<p>' + text.replace(/[\r\n]+/g, '</p><p>') + '</p>' : null);
    }
});

personasApp.filter('nl2li', function () {
    return function(text){
        text = String(text).trim();
        return (text.length > 0 ? '<li>' + text.replace(/[\r\n]+/g, '</li><li>') + '</li>' : null);
    }
});

personasApp.filter('inWords', function () {
    return function(text) {
        if (text && text.length > 0 && parseInt(text)) {
            return inWords(parseInt(text));
        } else {
            return text;
        }
    }
});

personasApp.filter('capFirstLetter', function () {
    return function(text) {
        if (text && text.length > 0) {
             return text[0].toUpperCase() + text.slice(1);
        } else {
            return text;
        }
    }
})
