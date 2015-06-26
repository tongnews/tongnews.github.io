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
    //if(tdbg)console.log(document.domain);
    return document.domain;
}
function getUrlParam(sParam) { 
    if(window.location.hash) {
       var sPageURL = window.location.hash.substr(2);
    } else {
       var sPageURL = window.location.search.substring(1);
    }
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
//    if(tdbg)console.log(postid);
//    var x = postid;
//    var y = x.toString();
//    var z = y.split("").reverse().join("");
//    z = z.concat(y);
//    var aa = Number(z);
//    var encod = aa ^ 942857;
//    //if(tdbg)console.log(encod);
//    return encod;
    return postid;
    //return encodedString = Base64.encode(postid+12345);
}
function decodeIdfromAddr() {
//    var x = getUrlParam("id") ^ 942857;
//    var y = "0000000000"+x.toString();
//    var y = y.substr(y.length-6);
//    var z = y.substring(y.length / 2);
//    if(tdbg)console.log(y);
//    if(tdbg)console.log(Number(z));
    var id=getUrlParam("id");
    //if(tdbg)console.log("post"+id);
    if(typeof id == 'undefined'){
        id=getRewriteParam();
    }
    return Number(id);
    //var postid = Base64.decode(getUrlParam("id"))-12345;
    //return postid;
}

//Video referrence
var $videolinkpref = "bilibili";
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
            //if(tdbg)console.log("this is tudo"+$linkstr[i]);
        }
        if ($linkstr[i].indexOf("hdslb") > -1) {
            $videolink["bilibili"] = $linkstr[i];
            $videolink["avaliable"] = "bilibili";
            //if(tdbg)console.log("this is bilibili"+$linkstr[i]);
        }
    }
    return $videolink;
}

var tdbg=false;

//-------------------------Animation Contronller ----------------//
function pageScroll() {
    window.scrollBy(0, -2200);
    scrolldelay = setTimeout('pageScroll()', 1000);
    if (document.documentElement.scrollTop == 0) clearTimeout(scrolldelay);
}





//-------------------------User Contronller --------------------//
var userLogin = false;
var userlevel = 0;
var usernickname = null;
function getManagerlogin() {
    return userLogin;
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
        //if(tdbg)console.log("cookie " + curcookie);
        var questurl = getBaseUrl().concat("api/user/validate_auth_cookie/?cookie=" + curcookie);
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                //if(tdbg)console.log('check_cookie');
                //if(tdbg)console.log(response.valid);
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
                            //if(tdbg)console.log(response);
                            sucessLogin(response);
                        }
                    });
                } else {
                    //if(tdbg)console.log('not');
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
    userLogin = true;
    userlevel = response.wp_user_level;
    usernickname = response.nickname;
    document.getElementById("user_welcome").innerHTML = "&nbsp;欢迎您 | " + response.nickname +"&nbsp;";
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

function resetCookie(){
    createCookie("user","",14);
}

function logTimeNow(text){
    var time=new Date();
    if(tdbg)console.log(text+':'+time.getMinutes()+':'+time.getSeconds());
}





//-------------------------Content Contronller ----------------//
var $curCount = 0,
    $maxPages = 0;

function urlrewrite(id){
    if(getDomain()=="www.tongnews.org" || getDomain()=="tongnews.org"){
        return "rp"+id;
    }else{
        return "tongpost.html?id=" +id;
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
            var postHtml=$('<div class="post_cell uniborder"><img class="post_img"><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div><div class="postslider"></div>');
        }else{
            var postHtml=$('<div class="post_cell uniborder"><img class="post_img"><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div>');
        }
           
        //replace title
        postHtml.find('a').text(response.posts[i].title.substring(0, 31));
        
        var $linkurl=urlrewrite(encodeId(response.posts[i].id));
        postHtml.find('a').attr("href",$linkurl);
        
        //replace info
        try {
            var flt_comment_count = response.posts[i].custom_fields.float_comment[0].split('$').length - 1;
        } catch (err) {
            var flt_comment_count = 0;
        }
        postHtml.find('li')[0].innerHTML = "<i class='fa fa-pencil fa-fw'></i>&nbsp;" + response.posts[i].author.nickname + " <i class='fa fa-clock-o fa-fw'></i>&nbsp;" + response.posts[i].date.substring(0, 10) + " <i class='fa fa-eye fa-fw'></i>&nbsp;" + response.posts[i].custom_fields.viewer_count[0] + " <i class='fa fa-comment fa-fw'></i>&nbsp;" + flt_comment_count;
        
        //replace intro
        postHtml.find('p').text(response.posts[i].custom_fields.intro[0]);
        var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl).replace(getBkdomainUrl(), cdnurl);
        $tbnlurl = $tbnlurl.replace(bkurl, cdnurl);

        postHtml.find('img').attr('src', $tbnlurl);
        postHtml.find('img').attr('tar', $linkurl);
        
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
                  tagstyle = 'style="border-color:rgb(253, 124, 152)"';
                  break;
              case "else":
                  tagstyle = 'style="border-color:#87b5eb"';
                  break;
              case "area":
                  tagstyle = 'style="border-color:rgb(255, 97, 49)"';
                  break;
              case "origin":
                  tagstyle = 'style="border-color:#bc7cfd"';
                  break;
              case "character":
                  tagstyle = 'style="border-color:#1ebbd0"';
                  break;
              case "activity":
                  tagstyle = 'style="border-color:#37d078"';
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
    
    $('.tag').hover(function () {
          $(this).css('background-color',$(this).css('border-color'));
            $(this).css('color','#fff');
    },function () {
          $(this).css('background-color','');
            $(this).css('color','#000000');
    });
    
    $('.post_img').click(function () {
        window.open($(this).attr('tar'));
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
                if(tdbg)console.log("viewing post " + response.post.title);
            }
        });
        //connect to post video frame
        var $videolink = videorefanlayse($(this).attr('ref'));
        //if(tdbg)console.log($(this).attr('ref'));
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
                if(tdbg)console.log("viewing post " + response.post.title);
            }
        });
        //connect to post video frame
        var $videolink = videorefanlayse($(this).attr('ref'));
        //if(tdbg)console.log($(this).attr('ref'));
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
    
    //if(tdbg)console.log(response);
    
    logTimeNow('IndexOtherJSON back');
    var $rank_container = $('#index_rank_contianer'),
    $rank_cells = $rank_container.find('.rank_cell');
    
    //set post basic title info and other
    for (var i = 0; i < rankCount; i++) {
        //replace title
        $rank_cells.eq(i).find('a').text(response.posts[i].title.substring(0, 31));
        $rank_cells.eq(i).find('a').attr("href", urlrewrite(encodeId(response.posts[i].id)));
        $("<div class='ref_id' post_id=" + response.posts[i].id + "></div>").insertAfter($rank_cells.eq(i).find('a'));
        var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl).replace(getBkdomainUrl(), cdnurl);
        $rank_cells.eq(i).find('img').attr('src', $tbnlurl);
    }
    
    logTimeNow('IndexOtherJSON end');
}
 
function categoryWidgetArranger(catslug,response,postCount,pageNum) {
    
    $curCount = response.count;
    $maxPages = response.pages;
    
    //set post basic title info and other
    for (var i = 0; i < $curCount; i++) {
        
        var postHtml=$('<div class="post_widget"><a target="_blank"><img><blockquote><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></a></div>');
           
        //replace title
        postHtml.find('p').text(response.posts[i].title.substring(0, 31));
        postHtml.find('a').attr("href", urlrewrite(encodeId(response.posts[i].id)));
        
        //replace intro

        var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
        $tbnlurl = $tbnlurl.replace(bkurl, cdnurl);

        postHtml.find('img').attr('src', $tbnlurl);
        
        postHtml.appendTo('#'+catslug);
    }
    
}

function categoryTnailArranger(catslug,response,postCount,pageNum) {
    
    $curCount = response.count;
    $maxPages = response.pages;

    //set post basic title info and other
    for (var i = 0; i < $curCount; i++) {
        
        var postHtml=$('<div class="post_wtnail" pid="1"><img><img><img><img><blockquote><a target="_blank"><td><p></p></td></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div>');
           
        //replace title
        postHtml.find('a').find('p').text(response.posts[i].title.substring(6, 31));
        var $linkurl=urlrewrite(encodeId(response.posts[i].id));
        postHtml.find('a').attr("href",$linkurl);
        
        postHtml.attr('tar',$linkurl);   
        postHtml.attr("pid",response.posts[i].id);
         
        for (var j = 0; j < 4; j++) { 
            try{
 postHtml.find('img').eq(j).attr('src',response.posts[i].attachments[j].images.thumbnail.url.replace(getRegBaseUrl(), cdnurl)); 
                }catch(err){}
        }

        postHtml.appendTo('#'+catslug);
    }
    
    $('.post_wtnail').click(function () {
        window.open($(this).attr('tar'));
    });
}

function relatedpostArranger(response){
    
    $('<h2>相关推荐</h2>').appendTo('#relatedpost');
    
    for(var i=0;i<response.message.count;i++){
        
        var postHtml=$('<div class="post_widget"><img><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div>');
           
        //replace title
        postHtml.find('a').text(response.message.posts[i].title.substring(0, 31));
        postHtml.find('a').attr("href", urlrewrite(encodeId(response.message.posts[i].id)));
        
        //replace thumbnail
        var $tbnlurl = response.message.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
        $tbnlurl = $tbnlurl.replace(bkurl, cdnurl);
        postHtml.find('img').attr('src', $tbnlurl);
        
        postHtml.appendTo('#relatedpost');
        
    }
    
}

function sitemapArranger(response){
    
    //if(tdbg)console.log(response);
    
    var $scurCount = response.count;
    var sitemapHtml=$('<div><div class="sitelinks"></div></div>');

    for (var i = 0; i < $scurCount; i++) {
        var postHtml=$('<div><a></a></div>');
        //replace title
        postHtml.find('a').text(response.posts[i].title.substring(0, 31));
        postHtml.find('a').attr("href", "tongpost.html#!id=" + encodeId(response.posts[i].id));
        postHtml.appendTo(sitemapHtml.find('.sitelinks'));
    }
    
    //if(tdbg)console.log(sitemapHtml.prop('outerHTML'));
    var blob = new Blob([sitemapHtml.prop('outerHTML')], {type: "text/html;charset=utf-8"});
    saveAs(blob, "sitemaplist.html");
    
}







//---------------------------------- search button-------------------
function searchformOnsubmit() {
    if (document.getElementById('search-box').value == "") {
        alert("请填写搜索内容~");
    }else{
        window.open('search.html#!type=s&key='+document.getElementById('search-box').value);
    }  
};


function detectIE() {
    
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function baseJSload(){
    
    if(true){
    $('body').prepend('<div class="top_container"> <div class="user_container"> <div class="login_container" style="width:0px; height:0px; overflow:hidden;"> <div class="sginbox" style="width:0px; height:0px; overflow:hidden;"> <input type="text" id="user_sginin_code_input" class="btshadow" placeholder="(邀请码)"> <input type="text" id="user_sginin_email_input" class="btshadow" placeholder="(邮箱)"> <input type="text" id="user_sginin_nickname_input" class="btshadow" placeholder="(昵称)"> <input type="password" id="user_sginin_pass_input" class="btshadow" placeholder="(密码)"> <input type="password" id="user_sginin_pass_input2" class="btshadow" placeholder="(密码确认)"> <li class="user_signin_submit btshadow">提交</li> <li class="user_back btshadow" id="user_back"><i class="fa fa-arrow-left fa-fw"></i></li> </div> <div class="loginbox" style="width:0px; height:0px; overflow:hidden;"> <input type="text" id="user_name_input" class="btshadow" placeholder="(邮箱)"> <input type="password" id="user_pass_input" class="btshadow" placeholder="(密码)"> <li class="user_login btshadow" id="user_login">登入</li> <li class="user_forget btshadow" id="user_forget">忘记密码</li> <li class="user_back btshadow" id="user_back"><i class="fa fa-arrow-left fa-fw"></i></li> </div> <div class="loginBtbox"> <li class="user_login_enter btshadow" id="user_login_enter">登陆</li> </div> <div class="signinBtbox"> <li class="user_signin btshadow" id="user_signin">极速注册</li> </div> </div> <div class="logined_container" style="width:0px; height:0px; overflow:hidden;"> <li id="user_welcome" class="btshadow">欢迎</li> <li id="user_logout" class="btshadow">登出</li> </div> </div> </div> <div class="title_container"> <div class="sheadin-container container"> <div class="title_content"> <div class="navs"><span class="hide">sakura</span> </div> <div class="uri"><span class="hide">标题</span> </div> <div class="navs" style="left:360px"><span class="hide">sakura</span> </div> </div> </div> </div> <div class="nav_container"> <div class="nav container"> <div class="nav_content"><div class="nava1"> <a></a> </div> <div class="nav1"><a href="index.html"><span class="hide">index</span></a> </div> <div class="navb1"> <a></a> </div> <div class="nava2"> <a></a> </div> <div class="nav6"><a href="photography.html"><span class="hide">photography</span></a> </div> <div class="navb2"> <a></a> </div> <div class="nava1"> <a></a> </div> <div class="nav2"><a href="xunli.html"><span class="hide">xunli</span></a> </div> <div class="navb1"> <a></a> </div> <div class="nava2"> <a></a> </div> <div class="nav3"><a href="reading.html"><span class="hide">reading</span></a> </div> <div class="navb2"> <a></a> </div> <div class="nava1"> <a></a> </div> <div class="nav7"><a href="about.html"><span class="hide">about</span></a> </div> <div class="navb1"> <a></a> </div><div class="search_container" onsubmit="searchformOnsubmit()"> <form class="search-form"> <input id="search-box" type="text" class="search-box uniborder" name="q" /> <label for="search-box"><span><i class="fa fa-search fa-fw search-icon"></i></span></label> <input type="submit" id="search-submit" /> </form> </div> </div> </div> </div>');
    };
    
    $('body').append('<div class="footer-bottom"><div class="inner-footer"><div id="footer-left"><div class="left">© 2015 痛新闻网站制作组<a href="about.html">关于我们</a></div><a href="about.html" class="footerCopyright">Designed by 小T酱</a></div><div class="clear"></div></div></div>');

            
    $('.uri').click(function () {
        window.location='index.html';
    });
    
    if(getDomain()=="www.tongnews.org" || getDomain()=="tongnews.org"){
        tdbg=false;
    }else{
        tdbg=true;
    }
    
    //-------------------------------back-top-------------------------------
    $('body').prepend('<p id="back-top"><a href="#top"><span></span>叮铃叮铃~</a></p>');
    
	$("#back-top").hide();
	
	// fade in #back-top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1400) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('#back-top a').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    
    //--------------------------IE check--------------------------------------
    var ieversion=detectIE();
    
    if(ieversion!=false && ieversion<11){
          $('body').prepend('<div class="browsertip"><div class="browsertip_img"><img src="images/browsertip.png"></div><div class="browsertip_link"><a target="_blank" href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html">谷歌chrome浏览器</a><a target="_blank" href="http://se.360.cn/">360安全浏览器</a><a target="_blank"  href="http://windows.microsoft.com/zh-cn/internet-explorer/ie-11-worldwide-languages">IE11浏览器</a></div></div>');
    };

    
//    $(".sitemap_download").click(function () {
//
//        var questurl = baseurl.concat("?json=get_recent_posts&count=999999&page=1");
//
//        //ajax for get recent post
//        $.ajax({
//            url: questurl,
//            jsonp: "callback",
//            dataType: "jsonp",
//            data: {
//                format: "json"
//            },
//            success: function (response) {
//               sitemapArranger(response)
//            }
//        });
//    });

    //----------------------------------  user login ----------------------------------------
    //enter event control
    $("#user_name_input").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_login').click();
        }
    });
    $("#user_pass_input").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_login').click();
        }
    });
    $("#user_sginin_email_input").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_signin_submit').click();
        }
    });
    $("#user_sginin_nickname_input").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_signin_submit').click();
        }
    });
    $("#user_sginin_pass_input").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_signin_submit').click();
        }
    });
    $("#user_sginin_pass_input2").keyup(function(event){
        if(event.keyCode == 13){
            $('.user_signin_submit').click();
        }
    });
    
    
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
                //if(tdbg)console.log(response);
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
                    $('.user_login').css('background','#FB708E');
                    alert("用户名或密码错误OwO");
                }
            }
        });
    });
    
    $('.user_forget').click(function () {
        
        if(document.getElementById('user_name_input').value==""){
            alert('请填写邮箱进行密码找回');
            return;
        }
        
        var questurl = baseurl.concat("api/send_user_pwresetemail/?email="+document.getElementById('user_name_input').value);
        if(tdbg)console.log(questurl);
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                if(tdbg)console.log(response);
                if (response.message == "ok") {
                    $('.user_forget').css('background','#b7b7b7');
                    alert("请查看您的邮箱进行密码修改~");
                } else {
                    $('.user_forget').css('background','#FB708E');
                    alert("用户名或密码错误OwO");
                }
            }
        });
        
    });
    
    $('.user_login_enter').click(function () {
         $(".sginbox").attr("style","width:0px; height:0px; overflow:hidden;");
         $(".loginbox").attr("style","");
         $(".loginBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
         $(".signinBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
    });
         
    $('.user_back').click(function () {
         $(".sginbox").attr("style","width:0px; height:0px; overflow:hidden;");
         $(".loginbox").attr("style","width:0px; height:0px; overflow:hidden;");
         $(".loginBtbox").attr("style","");
         $(".signinBtbox").attr("style","");
    });
    
    $('#user_logout').click(function () {
        resetCookie();
        location.reload();
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
                //if(tdbg)console.log(response);
                if (response.status == "ok") {
                   $user_nonce=response.nonce;
                   $(".sginbox").attr("style","");
                   $(".loginbox").attr("style","width:0px; height:0px; overflow:hidden;");
                   $(".loginBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
                   $(".signinBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
                    $('.user_signin').css('background','rgba(219, 47, 206, 0.93)');
                } else {
                    alert("十分抱歉，注册系统暂时关闭T0T");
                    $('.user_signin').css('background','rgba(219, 47, 206, 0.93)');
                }
            }
        });
    });

    $('.user_signin_submit').click(function () {

        if(document.getElementById('user_sginin_pass_input').value != document.getElementById('user_sginin_pass_input2').value){
            alert("密码输入不相同");
            return;
        }
        
        if(document.getElementById('user_sginin_nickname_input').value.indexOf(' ')>=0){
            alert("昵称含有空格等非法字符");
            return;
        }
        
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        var questurl = baseurl.concat("api/check_invitation_code/?code=" + document.getElementById('user_sginin_code_input').value+"&display_name=" + document.getElementById('user_sginin_nickname_input').value);
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                if(tdbg)console.log(response);
                
                //code success
                if (response.message == "success") {
                    var questurl = baseurl.concat("api/user/register/?username=" + document.getElementById('user_sginin_email_input').value + "&email=" +
                        document.getElementById('user_sginin_email_input').value + "&user_pass=" + document.getElementById('user_sginin_pass_input').value + "&display_name=" +
                        document.getElementById('user_sginin_nickname_input').value + "&nickname=" +
                        document.getElementById('user_sginin_nickname_input').value + "&nonce=" + $user_nonce + "&notify=no");
                    $.ajax({
                        url: questurl,
                        jsonp: "callback",
                        dataType: "jsonp",
                        data: {
                            format: "json"
                        },
                        success: function (response) {
                            if(tdbg)console.log(response);
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
                                if(tdbg)console.log(response.error);
                                switch(response.error){
                                    case "E-mail address is already in use.": 
                                        alert("邮箱曾被注册过,快来登录吧"); 
                                        break;
                                    default: 
                                        alert("用户名或密码错误/无效OwO"); 
                                        break;
                                }
                                $('.user_signin_submit').css('background', '#FB708E');
                            }
                        }
                    });
                }
                
                //code invalid
                if (response.message == "name_exist") {
                    alert("该昵称已被注册");
                    $('.user_signin_submit').css('background', '#FB708E');
                }
                
                //code invalid
                if (response.message == "invalid") {
                    alert("邀请码错误OwO");
                    $('.user_signin_submit').css('background', '#FB708E');
                }
                
                //code invalid
                if (response.message == "soldout") {
                    alert("不好意思>0< 邀请码已达到次数上线/注册关闭");
                    $('.user_signin_submit').css('background', '#FB708E');
                }
                
            }
        });
        
        
        
    });

    $('.user_pwreset').click(function () {
         
        if(document.getElementById('pw_pass_input').value!=             document.getElementById('pw_pass2_input').value){
            alert("两次密码输入不一致");
            return;
        }
        
        var $token="";
        if(getUrlParam("token")){
            $token=getUrlParam("token");
        };
        
        var questurl = baseurl.concat("api/set_user_password?email=" + document.getElementById('pw_name_input').value + "&password=" + document.getElementById('pw_pass_input').value + "&token=" + $token);
        $(this).css('background','rgba(102, 251, 154, 0.67)');
        $(this).css('color','rgb(255, 255, 255)');
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
               if(tdbg)console.log(response);
               $('.user_pwreset').attr('style', '');
               if (response.message == "success") {
                   $('.success').attr('style', '');
                   $('.failure').attr('style', 'width:0px; height:0px; overflow:hidden;');
               }
               if (response.message == "invalid") {
                   $('.success').attr('style', 'width:0px; height:0px; overflow:hidden;');
                   $('.failure').attr('style', '');
               }

           }
        });
        
        
    });
    

}

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=t.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,s=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},u="application/octet-stream",f=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){s(i)}}},p=function(t,s){var d,p,w,y=this,m=t.type,S=!1,h=function(){v(y,"writestart progress write writeend".split(" "))},O=function(){if((S||!d)&&(d=n().createObjectURL(t)),p)p.location.href=d;else{var o=e.open(d,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=d)}y.readyState=y.DONE,h(),l(d)},b=function(e){return function(){return y.readyState!==y.DONE?e.apply(this,arguments):void 0}},g={create:!0,exclusive:!1};return y.readyState=y.INIT,s||(s="download"),r?(d=n().createObjectURL(t),o.href=d,o.download=s,i(o),y.readyState=y.DONE,h(),void l(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)&&(t=new Blob(["﻿",t],{type:t.type})),e.chrome&&m&&m!==u&&(w=t.slice||t.webkitSlice,t=w.call(t,0,t.size,u),S=!0),a&&"download"!==s&&(s+=".download"),(m===u||a)&&(p=e),c?(f+=t.size,void c(e.TEMPORARY,f,b(function(e){e.root.getDirectory("saved",g,b(function(e){var n=function(){e.getFile(s,g,b(function(e){e.createWriter(b(function(n){n.onwriteend=function(t){p.location.href=e.toURL(),y.readyState=y.DONE,v(y,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&O()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=y["on"+e]}),n.write(t),y.abort=function(){n.abort(),y.readyState=y.DONE},y.readyState=y.WRITING}),O)}),O)};e.getFile(s,{create:!1},b(function(e){e.remove(),n()}),b(function(e){e.code===e.NOT_FOUND_ERR?n():O()}))}),O)}),O)):void O())},w=p.prototype,y=function(e,t){return new p(e,t)};return w.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,y}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});