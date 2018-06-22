var app = angular.module('myApp', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'view-student.html'
        })
        .state('addStudent', {
            url: '/addStudent',
            templateUrl: 'add-student.html'
        })
        .state('editStudent', {
            url: '/home/editStudent',
            templateUrl: 'edit-student.html'
        });
});
app.factory("StudentService", function ($filter) {
    return new function () {
        var studentInfo = {};
        studentInfo.studentList = [];
        studentInfo.addStudent = function (indexId, id, name, dob) {
            studentInfo.studentList.push({ indexId, id, name, dob });
        }
        studentInfo.viewStudents = function () {
            return studentInfo.studentList;
        }
        studentInfo.getStudent = function (indexId) {
            console.log("In getStudent");
            console.log("Index id " + indexId);
            console.log(studentInfo.studentList);
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(indexId);
            console.log("POSITION "+position);
            return studentInfo.studentList[position];
        }
        studentInfo.editStudent = function (student) {
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(student.indexId);
            console.log(position);
            studentInfo.studentList[position] = student;
        }
        studentInfo.deleteStudent=function(indexId){
            // console.log(studentInfo.studentList[indexId]);
            var position=studentInfo.studentList.map(function(e){ return e.indexId; }).indexOf(indexId);
            studentInfo.studentList.splice(position,1);
        }
        return studentInfo;
    }
});
app.controller("MainController", function ($scope, $location, $route, $window, StudentService) {
    var indexId = 0;
    console.log("In MainController");
    $scope.incrementIndexId = function () {
        indexId++;
    }
    $scope.addStudent = function (id, name, dob) {
        console.log("Add student " + indexId + " " + id + " " + name + " " + dob);
        StudentService.addStudent(indexId, id, name, dob);
        $scope.incrementIndexId();
        $scope.students = StudentService.viewStudents();
        console.log($location.url());
        $location.url('/home');
        console.log($location.url());
    }
    $scope.viewStudents = function () {
        $scope.students = StudentService.viewStudents();
    }
    $scope.editStudent = function (indexId) {
        console.log("In edit Student");
        $scope.student = StudentService.getStudent(indexId);
        console.log($scope.student);
        $scope.submit = StudentService.editStudent($scope.student);
        $scope.students = StudentService.viewStudents();
    }

    $scope.deleteStudent=function(indexId){
        console.log("deleteStudent "+indexId);
        StudentService.deleteStudent(indexId);
        $scope.students = StudentService.viewStudents();
    }

});
app.directive("myStudent", function () {
    return {
        restrict: 'EA',
        templateUrl: 'view-student.html'
    }
});
app.directive('newStudent', function () {
    return {
        restrict: 'EA',
        templateUrl: 'add-student.html'
    };
});