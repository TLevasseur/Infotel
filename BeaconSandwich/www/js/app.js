(function(){
  'use strict';
  var app = angular.module('app', ['onsen']);

  app.controller('AppController', function($scope, $data) {
    var onLoad = function(){
      document.addEventListener('offline', function(){ alert("Vous êtes déconnecté, veuillez activer votre connexion internet.");  $data.setData();}, false);
      document.addEventListener('deviceready', onDeviceReady, false);
      $data.setData();
    };

    var onDeviceReady = function(){
      activateBluetooth();
      window.locationManager = cordova.plugins.locationManager;
      startScan();
    };

    var activateBluetooth = function(){
      // Enable bluetooth on android
      cordova.plugins.locationManager.isBluetoothEnabled().then(function(isEnabled){
        if (!isEnabled) {
          cordova.plugins.locationManager.enableBluetooth();
        }
      })
      .fail(console.error)
      .done();
    }

    var startScan = function(){
      // The delegate object holds the iBeacon callback functions specified below.
      var delegate = new locationManager.Delegate();

      // Called continuously when monitoring beacons
      delegate.didStartMonitoringForRegion = function (pluginResult) {
        var key = pluginResult.region.uuid.toUpperCase();
        var timeStamp = {};
        $.ajax({url: 'http://www.timeapi.org/utc/now.json?format=%25Y:%25m:%25d:%25H;',dataType: 'jsonp'}).done(function (response) {
           timeStamp = response.dateString.split(":");
        });

        // Gestion des historiques de rencontre de beacon
        if(!($data.beacons.indexOf({uuid:key})==1)){
          // Si le beacon n'a jamais été lu
          $data.beacons[key] = timeStamp;
          $data.setData();
          alert('maj '+key);
        } else {
          // Si la lecture est périmée, mettre à jour le timeStamp
          if(compareDate($data.beacons[key],timeStamp)){
            alert("maj deuxième rencontre");
            $data.beacons[key] = timeStamp;
            $data.setData();
          }
        }
      };

      // Set the delegate object to use
      locationManager.setDelegate(delegate);

      // Start monitoring and ranging beacons
      for (var i in $data.regions){
        var beaconRegion = new locationManager.BeaconRegion(i,$data.regions[i].uuid);

        // Start monitoring.
        locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();
      }
    };

    onLoad();
  });

  app.controller('MasterController', function($scope, $data) {
    $scope.LISTEDEFLUX = $data.data.LISTEDEFLUX;

    $scope.$watch(function () { return $data.data.LISTEDEFLUX }, function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.LISTEDEFLUX = newVal;
        }
    });

    $scope.showDetail = function(item) {
      $data.data.selectedItem = item;
      $scope.ons.navigator.pushPage('flux.html');
    };

    $scope.toggleSwitch = function(item) {
      item.AFFICHER = item.AFFICHER ? false : true ;
    };

  });

  app.controller('DetailController', function($scope, $data) {
    $scope.item = $data.data.selectedItem;
  });

  app.factory('$data', function() {
    this.data = {};
    this.beacons = {};
    this.regions = [{uuid:'ABC00000-0000-0000-0000-000000000000'},{uuid:'ABCD0000-0000-0000-0000-000000000000'},{uuid:'ABCDE000-0000-0000-0000-000000000000'},{uuid:'ABCDEF00-0000-0000-0000-000000000000'}];
    this.setData = function(){
        this.data = dataDuFabuleuxMondeDInternet();
    };
    return this;
  });
})();

compareDate = function(date1,date2) {
    Y1 = date1[1];
    M1 = date1[2];
    d1 = date1[3];
    h1 = date1[4];
    Y2 = date2[1];
    M2 = date2[2];
    d2 = date2[3];
    h2 = date2[4];

    if(Y2>Y1){
        return true;
    } else {
        if(M2>m1){
            return true;
        }else{
            if(d2>d1){
                return true;
            }else{
                // écart de deux heures
                if(h2>h1+2){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }
};

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


function message(source, titre, date, uuid, infos, priorite){
    return {TITRE:titre, DATE:date, SOURCE:source, UUID:uuid, INFOS:infos, PRIORITE:priorite};
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
            var uuid=laListeDesMessages[j].getElementsByTagName("uuid").item(0).firstChild.data;
            var infos=laListeDesMessages[j].getElementsByTagName("infos").item(0).firstChild.data;
            var priorite=laListeDesMessages[j].getElementsByTagName("priorite").item(0).firstChild.data;

            unFlux.ajouterMessage(message(source,titre,date,uuid,infos,priorite));
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
