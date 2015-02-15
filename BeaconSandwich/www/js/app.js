(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('tappaed');
      }, 100);
    };
  });

  // possibilité de bouchon créé via le JS
  module.factory('$data', function() {
      var data = {};
      data.items = []; 
      return data;
  });
})();

//      <!--Récupération des flux cochés-->
//      <script>
//        var checkedValue = [];
//        var inputElements = document.getElementsByClassName('fluxCheckbox');
//        for(var i=0; inputElements[i]; ++i){
//          if(inputElements[i].checked){
//            checkedValue[i] = inputElements[i].value;
//            break;
//          }
//        }
//      </script>
