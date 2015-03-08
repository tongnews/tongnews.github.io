
function getBaseUrl(){
    return "http://54.92.122.102/wordpress/";
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

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function pageScroll() {
    window.scrollBy(0,-800);
    scrolldelay = setTimeout('pageScroll()',1000);
    if(document.documentElement.scrollTop==0) clearTimeout(scrolldelay);
}

function encodeId(postid){
    return encodedString = Base64.encode(postid+12345);
}

function decodeIdfromAddr(){
    var postid = Base64.decode(getUrlParam("id"))-12345;
    return postid;
}

//e.g.
//<img src="http://img208.poco.cn/mypoco/myphoto/20110702/19/56945956201107021915139206804535901_001.jpg" onload="ReSizePic(this);">