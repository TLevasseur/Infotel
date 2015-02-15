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

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
  });

  module.controller('MasterController', function($scope, $data) {
    $scope.LISTEDEFLUX = $data.LISTEDEFLUX;  
    
    $scope.showDetail = function(index) {
      var selectedItem = $data.LISTEDEFLUX[index];
      $data.selectedItem = selectedItem;
      $scope.ons.navigator.pushPage('flux1.html', {TitreDuFlux : selectedItem.NOM});
    };
  });

  module.factory('$data', function() {
    var data = {};
    
    data.LISTEDEFLUX = [
    
    
    {
      NOM:'Les annonces du BDE',
      LISTEDEMESSAGES:
      {
        MESSAGE1:
        {
          TITRE:'Construction d une fontaine de chocolat',
          DATE:'09/09/9999',
          SOURCE:'Pole communication',
          INFOS:'          Bonjour          Suite à la recette exceptionnelle de cette année, nous allons construire une fontaine de chocolat en septembre.'
        },
        MESSAGE2:
        {
          TITRE:'Faillite ',
          DATE:'03/03/2015',
          SOURCE:'Direction',
          INFOS:'Bonjour          Le BDE est à la rue depuis un mois.'
        }

        
      }
      
    },
    {
      NOM:'Menu de la Cantine',
      LISTEDEMESSAGES:
      {
        MESSAGE1:
        {
          TITRE:'Menu de demain',
          DATE:'07/02/2015',
          SOURCE:'Monique de la cuisine',
          INFOS:'Bonjour          Ce mardi, nous aurons pour déjeuner du poulet aux olives.'
        },
        MESSAGE2:
        {
          TITRE:'Menu de ce midi ',
          DATE:'02/03/2015',
          SOURCE:'Monique de la cuisine',
          INFOS:'          Bonjour          Ce lundi, nous aurons pour déjeuner du boudain noir.'
        }

        
      }
      
    }

    

    
    ]; 

      // data=fonctionQuiREnvoieTableau()
      
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
