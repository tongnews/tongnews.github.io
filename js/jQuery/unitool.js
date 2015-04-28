//-------------------------Resources Contronller----------------//

//Url Control
function getBaseUrl() {
    return "http://54.92.122.102/wordpress/";
}
function getRegBaseUrl() {
    return /http:\/\/54.92.122.102\/wordpress\//g;
}
function getBkdomainUrl() {
    return "http://bk.tongnews.org/wordpress/";
}
function getCDNUrl() {
    return "http://7xi53n.com1.z0.glb.clouddn.com/";
}
function getDomain() {
    //console.log(document.domain);
    return document.domain;
}
function getUrlParam(sParam) {
    var sPageURL = window.location.hash.substr(2);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function getRewriteParam() {
    var sParameter = window.location.pathname.substr(3);
    return sParameter;
}

function encodeId(postid) {
//    console.log(postid);
//    var x = postid;
//    var y = x.toString();
//    var z = y.split("").reverse().join("");
//    z = z.concat(y);
//    var aa = Number(z);
//    var encod = aa ^ 942857;
//    //console.log(encod);
//    return encod;
    return postid;
    //return encodedString = Base64.encode(postid+12345);
}
function decodeIdfromAddr() {
//    var x = getUrlParam("id") ^ 942857;
//    var y = "0000000000"+x.toString();
//    var y = y.substr(y.length-6);
//    var z = y.substring(y.length / 2);
//    console.log(y);
//    console.log(Number(z));
    var id=getUrlParam("id");
    //console.log("post"+id);
    if(typeof id == 'undefined'){
        id=getRewriteParam();
    }
    return Number(id);
    //var postid = Base64.decode(getUrlParam("id"))-12345;
    //return postid;
}

//Video referrence
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








//-------------------------Animation Contronller ----------------//
function pageScroll() {
    window.scrollBy(0, -800);
    scrolldelay = setTimeout('pageScroll()', 1000);
    if (document.documentElement.scrollTop == 0) clearTimeout(scrolldelay);
}





//-------------------------User Contronller --------------------//
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
                            //console.log(response);
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
    document.getElementById("user_welcome").innerHTML = "&nbsp; 欢迎您 | " + response.nickname +"&nbsp;";
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
function logTimeNow(text){
    var time=new Date();
    console.log(text+':'+time.getMinutes()+':'+time.getSeconds());
}





//-------------------------Content Contronller ----------------//
var $curCount = 0,
    $maxPages = 0;

function urlrewrite(id){
    if(getDomain()=="www.tongnews.org" || getDomain()=="tongnews.org"){
        return "rp"+id;
    }else{
        return "tongpost.html#!id=" +id;
    }
}

function postArranger(response,postCount,source){
    
    $curCount = response.count;
    $maxPages = response.pages;

    switch(source){
            case "index":
                $(".post_cell_container").find(".post_cell").remove();
                $(".post_cell_container").find(".postslider").remove();
                break;
    }
   
    //set post basic title info and other
    for (var i = 0; i < $curCount; i++) {
        
        if(i<($curCount-1)){
            var postHtml=$('<div class="post_cell uniborder"><img><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div><div class="postslider"></div>');
        }else{
            var postHtml=$('<div class="post_cell uniborder"><img><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div>');
        }
           
        //replace title
        postHtml.find('a').text(response.posts[i].title.substring(0, 31));
        

        postHtml.find('a').attr("href", urlrewrite(encodeId(response.posts[i].id)));
        //replace info
        try {
            var flt_comment_count = response.posts[i].custom_fields.float_comment[0].split('$').length - 1;
        } catch (err) {
            var flt_comment_count = 0;
        }
        postHtml.find('li')[0].innerHTML = "<i class='fa fa-pencil fa-fw'></i>&nbsp;" + response.posts[i].author.nickname + " <i class='fa fa-clock-o fa-fw'></i>&nbsp;" + response.posts[i].date.substring(0, 10) + " <i class='fa fa-eye fa-fw'></i>&nbsp;" + response.posts[i].custom_fields.viewer_count[0] + " <i class='fa fa-comment fa-fw'></i>&nbsp;" + flt_comment_count;
        //replace intro
        postHtml.find('p').text(response.posts[i].custom_fields.intro[0]);
        var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
        $tbnlurl = $tbnlurl.replace(bkurl, cdnurl);

        postHtml.find('img').attr('src', $tbnlurl);

        //remove addional attribute
        postHtml.find(".float_video_link").remove();

        //check if it is a video
        var $postCategories = response.posts[i].categories;
        for (var j = 0; j < $postCategories.length; j++) {
            if ($postCategories[j].slug == "video") {
                var $video_link = response.posts[i].custom_fields.video_link[0];
                $("<div class='float_video_link' ref='" + $video_link + "' post_id=" + response.posts[i].id + "></div>").insertAfter(postHtml.find('p'));
                break;
            }
        }

        //add tages into post
        postHtml.find(".tag").remove();
        var $postTags = response.posts[i].tags;
        for (var j = 0; j < $postTags.length; j++) {
            var tagstyle='style="background-color:#FD7C98"';
            switch ($postTags[j].group) {
              case "not assigned":
                  tagstyle = 'style="background-color:#808080"';
                  break;
              case "else":
                  tagstyle = 'style="background-color:#FD7C98"';
                  break;
              case "area":
                  tagstyle = 'style="background-color:#rgb(255, 41, 181)"';
                  break;
              case "origin":
                  tagstyle = 'style="background-color:#bc7cfd"';
                  break;
              case "character":
                  tagstyle = 'style="background-color:#1ebbd0"';
                  break;
              case "activity":
                  tagstyle = 'style="background-color:#37d078"';
                  break;
          };
            $("<li class='tag' "+tagstyle+">" + $postTags[j].title + "</li>").insertBefore(postHtml.find('#tagend'));
        }

        
        postHtml.appendTo('.post_cell_container');
    }
    
    //control click event of tag searching
    $('.tag').click(function () {
          window.open('search.html#!type=t&key='+$(this).text());
    });

    //control click event of float video button
    $('.float_video_link').click(function () {
        var questurl = baseurl.concat("?json=view_post&id=" + $(this).attr('post_id'));
        //ajax for add viewer_count for this post
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                console.log("viewing post " + response.post.title);
            }
        });
        //connect to post video frame
        var $videolink = videorefanlayse($(this).attr('ref'));
        //console.log($(this).attr('ref'));
        var linktype = getVideoLinkref();
        if (typeof $videolink[linktype] == 'undefined') {
            linktype = $videolink["avaliable"];
        }
        if (linktype == "tudo") {
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('iframe').replaceWith($videolink[linktype]);
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "");
        }
        if (linktype == "bilibili") {
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').replaceWith($videolink[linktype]);
            $('#index_float_video_ply').find('embed').eq(0).attr("width", "");
            $('#index_float_video_ply').find('embed').eq(0).attr("height", "");
        }
        $('#index_float_video_ply').attr("style", "right: " + $fly_video_right);
    });
    
    $('.loading_cover').attr("style","width:0px; height:0px; overflow:hidden;");

    for (var i = $curCount; i < postCount; i++) {
        $post_cells.eq(i).attr("style", "width:0px; height:0px; overflow:hidden;");
    }

    //control click event of tag searching
    $('.tag').click(function () {
          window.open('search.html?type=t&key='+$(this).text());
    });

    //control click event of float video button
    $('.float_video_link').click(function () {
        var questurl = baseurl.concat("?json=view_post&id=" + $(this).attr('post_id'));
        //ajax for add viewer_count for this post
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                console.log("viewing post " + response.post.title);
            }
        });
        //connect to post video frame
        var $videolink = videorefanlayse($(this).attr('ref'));
        //console.log($(this).attr('ref'));
        var linktype = getVideoLinkref();
        if (typeof $videolink[linktype] == 'undefined') {
            linktype = $videolink["avaliable"];
        }
        if (linktype == "tudo") {
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('iframe').replaceWith($videolink[linktype]);
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "");
        }
        if (linktype == "bilibili") {
            $('#index_float_video_ply').find('iframe').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').eq(0).attr("style", "width:0px; height:0px; overflow:hidden;");
            $('#index_float_video_ply').find('embed').replaceWith($videolink[linktype]);
            $('#index_float_video_ply').find('embed').eq(0).attr("width", "");
            $('#index_float_video_ply').find('embed').eq(0).attr("height", "");
        }
        $('#index_float_video_ply').attr("style", "right: " + $fly_video_right);
    });

    logTimeNow('PostJSON end');
}

function rankArranger(response, rankCount, source) {
    
    //console.log(response);
    
    logTimeNow('RankJSON back');
    var $rank_container = $('#index_rank_contianer'),
    $rank_cells = $rank_container.find('.rank_cell');
    
    //set post basic title info and other
    for (var i = 0; i < rankCount; i++) {
        //replace title
        $rank_cells.eq(i).find('a').text(response.posts[i].title.substring(0, 31));
        $rank_cells.eq(i).find('a').attr("href", urlrewrite(encodeId(response.posts[i].ID)));
        $("<div class='ref_id' post_id=" + response.posts[i].id + "></div>").insertAfter($rank_cells.eq(i).find('a'));
        var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
        $rank_cells.eq(i).find('img').attr('src', $tbnlurl);
    }
    
    logTimeNow('RankJSON end');
}
    
function sitemapArranger(response){
    
    //console.log(response);
    
    var $scurCount = response.count;
    var sitemapHtml=$('<div><div class="sitelinks"></div></div>');

    for (var i = 0; i < $scurCount; i++) {
        var postHtml=$('<div><a></a></div>');
        //replace title
        postHtml.find('a').text(response.posts[i].title.substring(0, 31));
        postHtml.find('a').attr("href", "tongpost.html#!id=" + encodeId(response.posts[i].id));
        postHtml.appendTo(sitemapHtml.find('.sitelinks'));
    }
    
    //console.log(sitemapHtml.prop('outerHTML'));
    var blob = new Blob([sitemapHtml.prop('outerHTML')], {type: "text/html;charset=utf-8"});
    saveAs(blob, "sitemaplist.html");
    
}

function baseJSload(){
    //---------------------------------- search button-------------------
    $('.search_button').click(function () {
        if (document.getElementById('search_input').value == "") {
            alert("请填写搜索内容~");
        }else{
            window.open('search.html#!type=s&key='+document.getElementById('search_input').value);
        }  
    });

    $(".sitemap_download").click(function () {

        var questurl = baseurl.concat("?json=get_recent_posts&count=999999&page=1");

        //ajax for get recent post
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
               sitemapArranger(response)
            }
        });
    });

    //----------------------------------  user login ----------------------------------------
    $('.user_login').click(function () {
        var questurl = baseurl.concat("api/user/generate_auth_cookie/?username=" + document.getElementById('user_name_input').value + "&password=" + document.getElementById('user_pass_input').value);
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                //console.log(response);
                if (response.status == "ok") {
                    createCookie("user", response.cookie, 14);
                    var questurl = baseurl.concat("api/user/get_user_meta/?cookie=" + response.cookie);
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
                    alert("用户名或密码错误OwO");
                    $(this).css('background','rgba(251, 102, 142, 0.67)');
                }
            }
        });
    });

    var $user_nonce="";

    $('.user_signin').click(function () {
        var questurl = baseurl.concat("api/get_nonce/?controller=user&method=register");
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                //console.log(response);
                if (response.status == "ok") {
                   $user_nonce=response.nonce;
                   $(".sginbox").attr("style","");
                   $(".loginbox").attr("style","width:0px; height:0px; overflow:hidden;");
                   $(".loginBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
                   $(".signinBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
                } else {
                    alert("十分抱歉，注册系统暂时关闭T0T");
                    $(this).css('background','rgba(251, 102, 142, 0.67)');
                }
            }
        });
    });

    $('.user_signin_submit').click(function () {

        if(document.getElementById('user_sginin_pass_input').value != document.getElementById('user_sginin_pass_input2').value){
            alert("密码输入不相同");
            return;
        }

        var questurl = baseurl.concat("api/user/register/?username=" + document.getElementById('user_sginin_email_input').value + "&email=" +
    document.getElementById('user_sginin_email_input').value + "&user_pass=" + document.getElementById('user_sginin_pass_input').value + "&display_name=" +
    document.getElementById('user_sginin_nickname_input').value + "&nickname=" +
    document.getElementById('user_sginin_nickname_input').value + "&nonce=" + $user_nonce);
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                console.log(response);
                if (response.status == "ok") {
                    createCookie("user", response.cookie, 14);
                    var questurl = baseurl.concat("api/user/get_user_meta/?cookie=" + response.cookie);
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
                    alert("用户名或密码错误/无效OwO");
                    $(this).css('background','rgba(251, 102, 142, 0.67)');
                }
            }
        });
    });
}

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=t.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,s=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},u="application/octet-stream",f=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){s(i)}}},p=function(t,s){var d,p,w,y=this,m=t.type,S=!1,h=function(){v(y,"writestart progress write writeend".split(" "))},O=function(){if((S||!d)&&(d=n().createObjectURL(t)),p)p.location.href=d;else{var o=e.open(d,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=d)}y.readyState=y.DONE,h(),l(d)},b=function(e){return function(){return y.readyState!==y.DONE?e.apply(this,arguments):void 0}},g={create:!0,exclusive:!1};return y.readyState=y.INIT,s||(s="download"),r?(d=n().createObjectURL(t),o.href=d,o.download=s,i(o),y.readyState=y.DONE,h(),void l(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)&&(t=new Blob(["﻿",t],{type:t.type})),e.chrome&&m&&m!==u&&(w=t.slice||t.webkitSlice,t=w.call(t,0,t.size,u),S=!0),a&&"download"!==s&&(s+=".download"),(m===u||a)&&(p=e),c?(f+=t.size,void c(e.TEMPORARY,f,b(function(e){e.root.getDirectory("saved",g,b(function(e){var n=function(){e.getFile(s,g,b(function(e){e.createWriter(b(function(n){n.onwriteend=function(t){p.location.href=e.toURL(),y.readyState=y.DONE,v(y,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&O()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=y["on"+e]}),n.write(t),y.abort=function(){n.abort(),y.readyState=y.DONE},y.readyState=y.WRITING}),O)}),O)};e.getFile(s,{create:!1},b(function(e){e.remove(),n()}),b(function(e){e.code===e.NOT_FOUND_ERR?n():O()}))}),O)}),O)):void O())},w=p.prototype,y=function(e,t){return new p(e,t)};return w.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,y}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});