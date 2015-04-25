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
    return Number(getUrlParam("id"));
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
        postHtml.find('a').attr("href", "tongpost.html?id=" + encodeId(response.posts[i].id));
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