// Main JS should go here!
// Include scripts using Browserify by doing:
var $ = require('jquery');
//window.$ = $;
var angular = require('angular');
var personasApp = angular.module('personasApp',[]);
var personaPhotos = require("../Data/people.json");

var defaultPersonaData = {
selectedDevices : {
    "Desktop":false,
    "Laptop":false,
    "Tablet":false,
    "Smart Phone":false,
    "Office Phone":false,
    "Printer":false,
    "Fax":false
},
maxCharacterCounts: {
    "about": 500,
    "quote": 150,
    "questions": 300
},
techUnderstanding:0,
changeComfort:0,
};

var storedIndex;

function sortJsonData (jsonData) {
	var sorted = jsonData.sort(function(a, b) {
		if (a.age > b.age) {
			return 1;
		}
		if (a.age < b.age) {
			return -1;
		}
		// a must be equal to b
		return 0;
	});

	return (sorted);
}

 function getAgeBase (age, data) {
	var base;
	var minDataAge = data[0].age;
	var maxDataAge = data[data.length - 1].age;
	//
	if (age >= minDataAge && age <= maxDataAge) {
		var hold = age.toString()[0];
		base = parseInt(hold + 0);
	} else {

		if (age < minDataAge) {
			base = parseInt(minDataAge);
		}

		if (age > maxDataAge) {
			base = parseInt(maxDataAge);
		}
	}

	return (base);
}

function filterJsonData (base, data, gender) {
	var results = data.filter(function(obj) {
		return (obj.age == base && obj.gender.toLowerCase() == gender.toLowerCase());
	});

	return (results);
}

 function getRandomImage (data) {
	var max = data.length - 1;
	var min = 0;
	var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;

	while (storedIndex === randomIndex) {
		randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
	}

	storedIndex = randomIndex;
    var obj = data[randomIndex];
	return (obj.gender+"/"+obj.age+"/"+obj.fileName);

}

personasApp.controller('AppController', ['$scope', function($scope) {
    $scope.className = "";
    $scope.isViewing = false;
    $scope.personaPhotos = personaPhotos;
    $scope.personaData = angular.copy(defaultPersonaData);
    $scope.personaFor = "";

    $scope.toggleClass = function(className) {
        $scope.className = $scope.className === "" ? className : "";
    }

    $scope.resetPersona = function() {
        var holdQuestions = $scope.personaData.questions;
        angular.copy(defaultPersonaData, $scope.personaData);
        $scope.personaData.questions = holdQuestions;
    }

    $scope.togglePersonaView = function() {
        $scope.isViewing = !$scope.isViewing;
    }

    $scope.getRandomImage = function() {
        if($scope.personaData.age && $scope.personaData.gender) {
            var sortedData = sortJsonData(personaPhotos);
            var ageBase = getAgeBase($scope.personaData.age, sortedData);
            var filteredData = filterJsonData(ageBase, sortedData, $scope.personaData.gender);
            $scope.personaData.imageFile = getRandomImage(filteredData);
        }
	}

    $scope.printPersona = function() {
        var title = document.title;
        var name = $scope.personaData.name;
        var n = title.indexOf('for');
        title = title.substring(0, n != -1 ? n : title.length);

        if (name)
        {
            document.title = title + " for " + name;
        }

        window.print();
    }
}]);

personasApp.component('personaQuestion', {
    bindings: {
        ngModel: '=',
        defaultQuestionText: '@'
    },
    controller: ["$element", "$timeout", function($element, $timeout) {
        this.isEditing = false;
        this.ngModel = this.defaultQuestionText;

        function toggleEditing() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                $timeout(function() {
                    $element.children("input")[0].focus();
                    $element.children("input")[0].setSelectionRange(0, $element.children("input")[0].value.length);
                }, 0);
            } else {
                if(this.ngModel.trim().length === 0) {
                    this.ngModel = this.defaultQuestionText;
                }
            }
        }
        this.toggleEditing = toggleEditing;
    }],
    template: `
        <label ng-click="$ctrl.toggleEditing()" for="" ng-if="!$ctrl.isEditing">{{$ctrl.ngModel}}</label>
        <input type="text" class="text-field" ng-if="$ctrl.isEditing" ng-blur="$ctrl.toggleEditing()" ng-model="$ctrl.ngModel"/>
    `
});
