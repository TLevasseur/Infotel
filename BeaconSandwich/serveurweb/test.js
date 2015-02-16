
//Code pour récupérer le petit fichier XML sur le serveur. Ce code est appellé par le script dans test.html

var AjaxCaching = false;

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
                descriptionConsole(lesFlux);
                //display(lesFlux, storage);
            }
        }
    }; 

    if(AjaxCaching == false)
        url = url + "?nocache=" + Math.random();
    xhr.open("GET", url , true);
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


function display(content, storage){
    //storage.innerHTML= content.getElementsByTagName("source").item(0).firstChild.data;
    storage.innerHTML= content.attributes;
}

