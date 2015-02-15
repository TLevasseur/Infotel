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
                var     content = xhr.responseText;
                display(content, storage);
            }
        } 
    }; 

    if(AjaxCaching == false)
        url = url + "?nocache=" + Math.random();
    xhr.open("GET", url , true);
    xhr.send(null); 
}


function display(content, storage){
    storage.innerHTML = content;
}