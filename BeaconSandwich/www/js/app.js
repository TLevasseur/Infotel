(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $data) {
  });

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
  });

  module.controller('MasterController', function($scope, $data) {
    $scope.LISTEDEFLUX = $data.LISTEDEFLUX;

    $scope.showDetail = function(item) {
      $data.selectedItem = item;
      $scope.ons.navigator.pushPage('flux.html');
    };

    $scope.toggleSwitch = function(item) {
      item.AFFICHER = item.AFFICHER ? false : true ;
    };

  });

  module.factory('$data', function() {
    alert('in factory');
    var data = dataDuFabuleuxMondeDInternet();
    return data;
  });
})();

alert('avant beacons');
////////////////////////////////////////////////////////////////////////////////
//
//
//                                 BEACONS
//
//
////////////////////////////////////////////////////////////////////////////////
var app = (function(){
  // Enable bluetooth on android
  alert('avant bluetooth');
  //cordova.plugins.locationManager.isBluetoothEnabled()
  //  .then(function(isEnabled){
  //    if (!isEnabled) {
  //      cordova.plugins.locationManager.enableBluetooth();
  //    }
  //  })
  //  .fail(console.error)
  //  .done();

  alert('après bluetooth');
  // Application object
  var app = {};

  // Beacon 128bit UUIDs
  var regions =
  [
    {uuid:'ABC00000-0000-0000-0000-000000000000'}
  ];

  // Dictionary of beacons
  var beacons = {};

  // Timer that displays list of beacons
  var updateTimer = null;

  app.onLoad = function(){
    alert('dans onload');
    document.addEventListener('deviceready', onDeviceReady, false);
    alert('après onload');
  };

  function onDeviceReady(){
    alert('dans onDeviceReady');
    // Specify a shortcut for the location manager holding the iBeacon functions.
    window.locationManager = cordova.plugins.locationManager;

    // Start scanning periodically
    updateTimer = setInterval(startScan, 20000);
  }

  function startScan(){
  // The delegate object holds the iBeacon callback functions specified below.
  var delegate = new locationManager.Delegate();

  // Called continuously when monitoring beacons
  delegate.didStartMonitoringForRegion = function (pluginResult) {
    alert('started monitoring');
    var id = pluginresult[region][identifier];
    alert('id '+id);
    var uuid = pluginresult[region][uuid];
    alert('uuid '+uuid);
    var beacon = {id:id,uuid:uuid,timestamp:Date.now()};
    if(beacons.indexOf(beacon)<0){
      alert('premiere insertion du beacon dans le dictionnaire');
      beacons.push(beacon);
    } else {
      alert('parcours de la liste de beacons');
      for(var beaconTemp in beacons){
        if((beaconTemp.id==id) & (beaconTemp.uuid==uuid) & (beaconTemp.timestamp+6000<Date.now())){
          beaconsTemp = beacon;
          alert('Mise à jour des annonces conseillée');
        }
      }
    }
  }

  // Called continuously when ranging beacons (considers proximity)
  //delegate.didRangeBeaconsInRegion = function (pluginResult) {
  //};

  // Set the delegate object to use
  alert('set delegate');
  locationManager.setDelegate(delegate);

  // Start monitoring and ranging beacons
  for (var i in regions){
    var beaconRegion = new locationManager.BeaconRegion(i,regions[i].uuid);

    // Start monitoring.
    locationManager.startMonitoringForRegion(beaconRegion).fail(console.error).done();

    // Start ranging.
    //locationManager.startRangingBeaconsInRegion(beaconRegion).fail(console.error).done();
    }
  }
  return app;
})();

alert('avant thibaud');
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
