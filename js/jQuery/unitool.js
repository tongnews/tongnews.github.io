function getBaseUrl() {
    return "http://54.92.122.102/wordpress/";
}

function getBkdomainUrl() {
    return "http://bk.tongnews.org/wordpress/";
}

function getCDNUrl() {
    return "http://7xi53n.com1.z0.glb.clouddn.com/";
}


function getDomain() {
    console.log(document.domain);
    return document.domain;
}

function getUrlParam(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

var $videolinkpref = "tudo";

function getVideoLinkref() {
    return $videolinkpref;
}

function setVideoLinkref(ref) {
    $videolinkpref = ref;
}

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

function pageScroll() {
    window.scrollBy(0, -800);
    scrolldelay = setTimeout('pageScroll()', 1000);
    if (document.documentElement.scrollTop == 0) clearTimeout(scrolldelay);
}

function encodeId(postid) {

    //console.log(postid);
    var x = postid;
    var y = x.toString();
    var z = y.split("").reverse().join("");
    z = z.concat(y);
    var aa = Number(z);
    var encod = aa ^ 942857;
    //console.log(encod);
    return encod;

    //return encodedString = Base64.encode(postid+12345);
}

function decodeIdfromAddr() {

    var x = getUrlParam("id") ^ 942857;
    var y = x.toString();
    var z = y.substring(y.length / 2);
    //console.log(Number(z));
    return Number(z);

    //var postid = Base64.decode(getUrlParam("id"))-12345;
    //return postid;
}

function videorefanlayse(refstr) {
    var $linkstr = refstr.split("$");
    var $videolink = [];
    for (var i = 0; i < Math.max($linkstr.length, 1); i++) {
        if ($linkstr[i].indexOf("tudo") > -1) {
            $videolink["tudo"] = $linkstr[i];
            $videolink["avaliable"] = "tudo";
            //console.log("this is tudo"+$linkstr[i]);
        }
        if ($linkstr[i].indexOf("hdslb") > -1) {
            $videolink["bilibili"] = $linkstr[i];
            $videolink["avaliable"] = "bilibili";
            //console.log("this is bilibili"+$linkstr[i]);
        }
    }
    return $videolink;
}

//user management
var managerLogin = false;

function getManagerlogin() {
    return managerLogin;
}

function getCookie() {
    if (readCookie("user")) {
        return readCookie("user");
    } else {
        return -1;
    }
}

function checkCookie() {
    //user handler
    var curcookie = getCookie();
    if (curcookie != -1) {
        //console.log("cookie " + curcookie);
        var questurl = getBaseUrl().concat("api/user/validate_auth_cookie/?cookie=" + curcookie);
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                //console.log('check_cookie');
                //console.log(response.valid);
                if (response.valid == true) {
                    var questurl = baseurl.concat("api/user/get_user_meta/?cookie=" + curcookie);
                    $.ajax({
                        url: questurl,
                        jsonp: "callback",
                        dataType: "jsonp",
                        data: {
                            format: "json"
                        },
                        success: function (response) {
                            sucessLogin(response);
                        }
                    });
                } else {
                    //console.log('not');
                    $(".login_container").attr("style", "");
                }
            }
        });
    } else {
        $(".login_container").attr("style", "");
    }
}

function sucessLogin(response) {
    $(".login_container").attr("style", "width:0px; height:0px; overflow:hidden;");
    $(".logined_container").attr("style", "");
    managerLogin = true;
    document.getElementById("user_welcome").innerHTML = "欢迎您, 管理员 <" + response.nickname + ">";
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}