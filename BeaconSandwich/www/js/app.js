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
      $scope.ons.navigator.pushPage('flux1.html');
    };

    $scope.toggleSwitch = function(index) {
      $data.LISTEDEFLUX[index].AFFICHER = $data.LISTEDEFLUX[index].AFFICHER ? false : true ;
    };

  });

  module.factory('$data', function() {
    var data = dataDuFabuleuxMondeDInternet();
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


/////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//            Partie de Thibaud ne pas toucher
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////





//stockage dégeu parce que fuck you
//Merci de ne pas me les piquer et de bien changer vos noms à vous !
var DATAS;
var AjaxCaching = false;



//fonction pricipales
//A appeller dès qu'on veux refresh les datas !
function dataDuFabuleuxMondeDInternet(){
    DATAS=null;
    var xhr = createXHR();

    var script = "http://levasseur.tf/beaconsandwich/flux.php";
    var filename = "http://levasseur.tf/beaconsandwich/flux.xml";

    xhr.onreadystatechange=function()
    {
        if(xhr.readyState == 4)
        {
             retrieve(filename);
        }
    };
        xhr.open("POST", script, false);//requette en asychrone dépréciated wesh
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(null);

        return DATAS;

}




//Code pour récupérer le petit fichier XML sur le serveur.
//Fonction qui crée des requettes propres quand on a besoin !
function createXHR() {
    var xhrObj;

    if (window.XMLHttpRequest) {
        // branch for native XMLHttpRequest object - Mozilla, IE7
        try {
            xhrObj = new XMLHttpRequest({mozSystem: true});
        } catch (e) {
            xhrObj = null;
        }
    } else if (window.createRequest) {
        /* For ICEbrowser -- untested.
         * per their site
         * http://support.icesoft.com/jive/entry.jspa?entryID=471&categoryID=21
         */
        try {
            xhrObj = window.createRequest();
        }
        catch (e) {
            xhrObj = null;
        }
    } else if (window.ActiveXObject) {
        // branch for IE/Windows ActiveX version
        try {
            xhrObj = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try{
                xhrObj = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(e) {
                xhrObj = null;
            }
        }//catch
    } //if-else
    return xhrObj;
}



//fonction qui fais des chauses qui nous interesse bien
function retrieve(url){
    var storage = document.getElementById("storage");
    var xhr = createXHR();
    xhr.onreadystatechange=function()
    {
        if(xhr.readyState == 4)
        {
            if(xhr.status == 200)
            {
                var     content = xhr.responseXML;
                var lesFlux=dataFromXML(content);
                DATAS=lesFlux;
                //descriptionConsole(lesFlux);
                //display(lesFlux, storage);
            }
        }
    };

    if(AjaxCaching == false)
        url = url + "?nocache=" + Math.random();
    xhr.open("GET", url , false);
    xhr.send(null);
}







//Le code d'interprétation de ce qu'on a obtenu avec les méthodes du dessus
//création des différents objets et instanciation à la volée






//Méthodes constructeur pour la sérialisation XML vers objet
function listeFlux(){
    return {LISTEDEFLUX:new Array(),
            ajouterflux:function(flux){this.LISTEDEFLUX.push(flux);}
            };
}


function flux(nom){
    return {NOM:nom,
            AFFICHER:true,
            LISTEDEMESSAGES:new Array(),
            ajouterMessage:function(message){this.LISTEDEMESSAGES.push(message);}
            };
}


function message(source, titre, date, uid, infos){
    return {TITRE:titre, DATE:date, SOURCE:source, UID:uid, INFOS:infos};
}


//Grosse méthode d'interprétation du fichier XML. bonne traduction ;)
function dataFromXML(xml){
    var laListeDesFlux=listeFlux();
    var lesFlux = xml.getElementsByTagName("flux");

    for (var i = 0; i < lesFlux.length; i++) {
        var unFlux=flux(lesFlux[i].getElementsByTagName("nom").item(0).firstChild.data);

        var laListeDesMessages=lesFlux[i].getElementsByTagName("message");

        for (var j = 0; j < laListeDesMessages.length; j++) {

            var source=laListeDesMessages[j].getElementsByTagName("source").item(0).firstChild.data;
            var titre=laListeDesMessages[j].getElementsByTagName("titre").item(0).firstChild.data;
            var date=laListeDesMessages[j].getElementsByTagName("date").item(0).firstChild.data;
            var uid=laListeDesMessages[j].getElementsByTagName("uid").item(0).firstChild.data;
            var infos=laListeDesMessages[j].getElementsByTagName("infos").item(0).firstChild.data;


            unFlux.ajouterMessage(message(source,titre,date,uid,infos));
        };
        laListeDesFlux.ajouterflux(unFlux);
    };
    return laListeDesFlux;
}


//fichier description sous console de ce qu'on obtient
//genre gros tests
function descriptionConsole(obj){
    console.log(obj);
    console.log(obj.LISTEDEFLUX[0]);
    console.log(obj.LISTEDEFLUX[0].LISTEDEMESSAGES[0]);
    console.log(obj.LISTEDEFLUX[0].LISTEDEMESSAGES[1]);
    console.log(obj.LISTEDEFLUX[1]);
    console.log(obj.LISTEDEFLUX[1].LISTEDEMESSAGES[0]);
    console.log(obj.LISTEDEFLUX[1].LISTEDEMESSAGES[1]);
    console.log(obj.LISTEDEFLUX[2]);
    console.log(obj.LISTEDEFLUX[2].LISTEDEMESSAGES[0]);

}

//fonction qui bug je sais pas trop pourquoi maintenant !
function display(content, storage){
    //storage.innerHTML= content.getElementsByTagName("source").item(0).firstChild.data;
    storage.innerHTML= content.LISTEDEFLUX[0].LISTEDEMESSAGES[0].INFOS;
    console.log("lol");
    console.log(content.LISTEDEFLUX[0].LISTEDEMESSAGES[0].INFOS);
}
