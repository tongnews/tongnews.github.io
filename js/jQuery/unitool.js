
function getBaseUrl(){
    return "http://54.92.122.102/wordpress/";
}

function getDomain(){
    console.log(document.domain);
    return document.domain;
}

function getUrlParam(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

var $videolinkpref="bilibili";

function getVideoLinkref(){
    return $videolinkpref;
}
function setVideoLinkref(ref){
    $videolinkpref=ref;
}

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function pageScroll() {
    window.scrollBy(0,-800);
    scrolldelay = setTimeout('pageScroll()',1000);
    if(document.documentElement.scrollTop==0) clearTimeout(scrolldelay);
}

function encodeId(postid){
    
    //console.log(postid);
    var x = postid;
    var y = x.toString();
    var z = y.split("").reverse().join("");
    z=z.concat(y);
    var aa = Number(z);
    var encod=aa^942857;
    //console.log(encod);
    return encod;
    
    //return encodedString = Base64.encode(postid+12345);
}

function decodeIdfromAddr(){
    
    var x=getUrlParam("id")^942857;
    var y = x.toString(); 
    var z = y.substring(y.length/2);
    //console.log(Number(z));
    return Number(z);
    
    //var postid = Base64.decode(getUrlParam("id"))-12345;
    //return postid;
}

function videorefanlayse(refstr){
    var $linkstr=refstr.split("$");
    var $videolink = [];
    for (var i = 0; i < Math.max($linkstr.length,1); i++) { 
        if($linkstr[i].indexOf("tudo")>-1){
            $videolink["tudo"]=$linkstr[i];
            $videolink["avaliable"]="tudo";
            //console.log("this is tudo"+$linkstr[i]);
        }
        if($linkstr[i].indexOf("hdslb")>-1){
            $videolink["bilibili"]=$linkstr[i];
            $videolink["avaliable"]="bilibili";
            //console.log("this is bilibili"+$linkstr[i]);
        }
    }
    return $videolink;
}
