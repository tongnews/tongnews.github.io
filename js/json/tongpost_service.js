var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $tongpost_id = 0;
var $commenton = 1;

var $commarray=[];

$(document).ready(function () {
    
    //nav footer function JS
    baseJSload();
    $('.rollingcomment_input').css('left',document.getElementById('tongpost_container').getBoundingClientRect().right -250 +'px');
    
    //user management
    checkCookie();
    //add event listener
    document.addEventListener("keydown", onCkeydown);
    //pull post
    $tongpost_id = decodeIdfromAddr();

    if (!isNaN($tongpost_id)) {
        var questurl = baseurl.concat("?json=view_post&id=" + $tongpost_id);
        //ajax for add viewer_count for this post
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                
                if(tdbg)console.log(response.post);

                var $tongpost_container = $('#tongpost_container');
                $tongpost_container.find('h2').text(response.post.title);
                
                $('#memo').attr('value','很喜欢文章:'+response.post.title+"，再接再厉!");
                
                document.title=response.post.title;
                //replace info
                try {
                    var flt_comment_count = response.post.custom_fields.float_comment[0].split('$').length - 1;
                } catch (err) {
                    var flt_comment_count = 0;
                }
                $tongpost_container.find('li')[0].innerHTML = "<i class='fa fa-pencil fa-fw'></i>&nbsp;" + response.post.author.nickname + " <i class='fa fa-clock-o fa-fw'></i>&nbsp;" + response.post.date.substring(0, 10) + " <i class='fa fa-eye fa-fw'></i>&nbsp;" + response.post.custom_fields.viewer_count[0] + " <i class='fa fa-comment fa-fw'></i>&nbsp;" + flt_comment_count;
                //replace intro
                $tongpost_container.find('p').text(response.post.custom_fields.intro[0]);
                //                var $tbnlurl = response.post.attachments[0].images.thumbnail.url;
                //                $tongpost_container.find('img').attr('src', $tbnlurl);
                
                //replace content
                $(response.post.content.toString().replace(getRegBaseUrl(), cdnurl).replace(bkurl, cdnurl)).insertAfter($tongpost_container.find('p'));
                
                //get attachment info
                var attarray=response.post.attachments;
                var mediumurls=[];
                var fullurls=[];
                for (var k = 0; k < attarray.length; k++) {
                    try {
                    mediumurls.push( attarray[k].images.medium.url.replace(getRegBaseUrl(), cdnurl));
                    } catch (err) {
                    mediumurls.push(attarray[k].images.full.url.replace(getRegBaseUrl(), cdnurl));
                    }
                    fullurls.push(attarray[k].images.full.url.replace(getRegBaseUrl(), cdnurl));
                }
                
                //regularize image width
                var imgset = $tongpost_container.find('img');
                for (var k=0; k<imgset.length ;k++){
                    
                    var imwidth = imgset.eq(k).attr('width');
                    //resize all to equal width
                    var aspratio = imgset.eq(k).attr('height')/imwidth;
                    var preheight = Math.floor(600*aspratio)+1;
                    imgset.eq(k).attr('width',600+'px');
                    imgset.eq(k).attr('height',preheight+'px');
                    
                    //change to img full attchment to medium attachment
                    try{
                        var isrc=imgset.eq(k).attr('src');
                        var imclass= imgset.eq(k).attr('class');
                        if(imclass.indexOf('medium')>-1 || imclass.indexOf('large')>-1 || jQuery.inArray(isrc,mediumurls)>-1){
                                //pass do not resize
                        }else{
                            var splits=isrc.split('.');
                            var send=splits.length-1;
                            imgset.eq(k).attr('src', mediumurls[jQuery.inArray(isrc,fullurls)]);
                        }
                    }catch(err){
                        
                    }
                }
                
                
                
                //forbidden all image link
                var ahrefset = $tongpost_container.find('a');
                for (var k=0; k<ahrefset.length ;k++){
                    var ahref = ahrefset.eq(k).attr('href');
                    if(ahref!=null){
                        if(ahref.indexOf('.jpg')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                        if(ahref.indexOf('.JPG')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                        if(ahref.indexOf('.png')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                        if(ahref.indexOf('.PNG')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                        if(ahref.indexOf('.jpeg')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                        if(ahref.indexOf('.JPEG')>-1){
                            ahrefset.eq(k).attr('alt',ahref);
                            ahrefset.eq(k).removeAttr("href");
                        }
                    }
//                    if(ahrefset.eq(k).find('img')!=null){
//                        var cnt = ahrefset.eq(k).contents();
//                        ahrefset.eq(k).replaceWith(cnt);
//                    }
                }
                
                var $postCategories = response.post.categories;
                for (var j = 0; j < $postCategories.length; j++) {
                    if ($postCategories[j].slug == "video") {
                        var $videolink = videorefanlayse(response.post.custom_fields.video_link[0]);
                        var linktype = getVideoLinkref();
                        if (typeof $videolink[linktype] == 'undefined') {
                            linktype = $videolink["avaliable"];
                        }
                        if (linktype == "tudo") {
                            $('<div class="videoshower">'+$videolink[linktype]+'</div>').insertAfter($tongpost_container.find('.intro'));
                            $tongpost_container.find('iframe').attr("style", "");
                            $tongpost_container.find('iframe').attr("id", "videoframe");
                            
                            
                            $('.videoshower').prepend('<div class="kuanping" t="1">宽屏显示</div>');
                            $('.kuanping').click(function () {
                                
                              if ($(this).attr('t') == 1) {
                                    $('#videoframe').css({
                                        'position': "fixed",
                                        'width': "1100px",
                                        'height': "670px",
                                        'margin-top': "-335px",
                                        'margin-left': "-550px",
                                        'top': "50%",
                                        'left': "50%",

                                    });
                                    $(this).css({
                                        'position': "fixed",
                                        'margin-bottom': "-360px",
                                        'margin-left': "-550px",
                                        'bottom': "50%",
                                        'left': "50%",
                                        'background-color': "rgba(157, 157, 157, 0.83)",
                                    });
                                    $(this).attr('t',2);
                                    $(this).text("返回");
                                }else{
                                    $('#videoframe').css({
                                        'position': "",
                                        'width': "",
                                        'height': "",
                                        'margin-top': "",
                                        'margin-left': "",
                                        'top': "",
                                        'left': "",

                                    });
                                    $(this).css({
                                        'position': "",
                                        'margin-bottom': "",
                                        'margin-left': "",
                                        'bottom': "",
                                        'left': "",
                                        'background-color':"",
                                    });
                                    $(this).attr('t',1);
                                    $(this).text("宽屏显示");
                                }
                               
                            });
                            
                            $('.videoshower').prepend('<div class="quanping" t="1">网页全屏</div>');
                            $('.quanping').click(function () {
                                
                              if ($(this).attr('t') == 1) {
                                    $('#videoframe').css({
                                        'position': "fixed",
                                        'width': "100%",
                                        'height': "100%",
                                        'top': "-20px",
                                        'left': "0%",
                                    });
                                    $(this).css({
                                        'position': "fixed",
                                        'bottom': "1%",
                                        'left': "10%",
                                        'z-index':"2001",
                                        'background-color': "rgba(157, 157, 157, 0.83)",
                                    });
                                    $(this).attr('t',2);
                                    $(this).text("返回");
                                }else{
                                    $('#videoframe').css({
                                        'position': "",
                                        'width': "",
                                        'height': "",
                                        'margin-top': "",
                                        'margin-left': "",
                                        'top': "",
                                        'left': "",
                                        
                                    });
                                    $(this).css({
                                        'position': "",
                                        'margin-bottom': "",
                                        'margin-left': "",
                                        'bottom': "",
                                        'left': "",
                                        'z-index':"",
                                        'background-color':"",
                                    });
                                    $(this).attr('t',1);
                                    $(this).text("网页全屏");
                                }
                               
                            });
                            
                            break;
                        }
                        if (linktype == "bilibili") {
                            $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">' + $videolink[linktype] + '</object>').insertAfter($tongpost_container.find('.intro'));
                            $('#index_float_video_ply').find('embed').eq(0).attr("width", "");
                            $('#index_float_video_ply').find('embed').eq(0).attr("height", "");
                            break;
                        }
                    }
                }

                //add tages into post
                $tongpost_container.eq(i).find(".tag").remove();
                var $postTags = response.post.tags;
                for (var j = 0; j < $postTags.length; j++) {
                    var tagstyle='style="background-color:#FD7C98"';
                    switch ($postTags[j].group) {
                      case "not assigned":
                          tagstyle = 'style="background-color:rgb(253, 124, 152)"';
                          break;
                      case "else":
                          tagstyle = 'style="background-color:#87b5eb"';
                          break;
                      case "area":
                          tagstyle = 'style="background-color:rgb(255, 97, 49)"';
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
                    $("<li class='tag' "+tagstyle+">" + $postTags[j].title + "</li>").insertBefore($tongpost_container.find('#tagend'));
                }
                
                $('.tag').click(function () {
                    window.open('search.html#!type=t&key=' + $(this).text());
                });
                
                //add comments
                try {
                    var comments = response.post.custom_fields.float_comment[0];
                    var cmarray = comments.split('$');
                    for (var i = 0; i < (cmarray.length - 1); i++) {
                        $commarray[i]=cmarray[i];
                        cmjson = JSON.parse(cmarray[i]);
                        //if(tdbg)console.log(cmjson);
                        $("<h3 class='flcomment' cont='' cid='"+i+"' user='"+cmjson.user+"' style='left:" + cmjson.x_pos + ";top:" + cmjson.y_pos + "'>" + "@" + cmjson.user + ": " + cmjson.text + "</h3>").insertAfter($('#tongpost_container').find('.end'));
                    }
                        
                    //manager float event
                    $('.flcomment').hover(function () {
                        //if(tdbg)console.log(usernickname+"="+$(this).attr('user'));
                        //if(tdbg)console.log(userlevel);
                        if(usernickname==$(this).attr('user') || userlevel==10){
                            $(this).css('background', 'rgba(126, 128, 127, 0.67)');
                            $(this).attr('cont', '(点击删除)');
                        }
                    },function () {
                        if(usernickname==$(this).attr('user') || userlevel==10){
                            $(this).css('background', 'rgba(251, 102, 134, 0.93)');
                            $(this).attr('cont', '');
                        }
                    });
                    $('.flcomment').click(function () {
                        if (usernickname==$(this).attr('user') || userlevel==10) {
                            var $float_comment = $commarray[$(this).attr('cid')].replace(/"/g,'$');
                            if(tdbg)console.log($float_comment);
                            var questurl = baseurl.concat("?json=remove_float_comment&id=" + $tongpost_id + "&comment=" + $float_comment);
                            $.ajax({
                                url: questurl,
                                jsonp: "callback",
                                dataType: "jsonp",
                                data: {
                                    format: "json"
                                },
                                success: function (response) {
                                    if(tdbg)console.log(response);
                                }
                            });
                            $(this).attr("style","width:0px; height:0px; overflow:hidden;");
                        }
                        
                    });
                    
                    //end
                } catch (err) {};
                
                //control image hover
                $('p').hover(function () {
                    if($(this).find("img").length>0){
                        $notOnImage=false;
                    };
                },function () {
                    $notOnImage=true;
                });
                
                //successor function
                $tongpost_id = decodeIdfromAddr();
                var questurl = baseurl.concat("?json=get_related_posts&id=" + $tongpost_id);
                //ajax for add viewer_count for this post
                $.ajax({
                    url: questurl,
                    jsonp: "callback",
                    dataType: "jsonp",
                    data: {
                        format: "json"
                    },
                    success: function (response) {
                        //if(tdbg)console.log(response);
                        relatedpostArranger(response);
                    }
                });
                
                //for primgage map load
                mapMarkerLoader(response);
                
                //sharing button
                window._bd_share_config = {
                    "common": {
                        "bdSnsKey": {
                            "tsina": "3566249745"
                        },
                        "bdText": "#痛新闻官网#"+response.post.title+"(@痛新闻_圣地巡礼)",
                        "bdMini": "2",
                        "bdMiniList": false,
                        "bdPic":                response.post.custom_fields.thumbnail_url[0].replace(baseurl, cdnurl).replace(bkurl, cdnurl),
                        "bdStyle": "1",
                        "bdSize": "32",
                        "width":"400px",
                        "height":"300px",
                    },
                    "share": {},
//                    "image": {
//                        "viewList": ["tsina", "qzone", "weixin", "tieba"],
//                        "viewText": "分享到：",
//                        "viewSize": "24",
//                        "viewColor" : 'rgba(231,231,231,0.1)',
//                    }
//                    slide : [{	   
//                        bdImg : 0,
//                        bdPos : "right",
//                        bdTop : 100
//                    },{
//                        bdImg : 0,
//                        bdPos : "left",
//                        bdTop : 100
//                    }]
                };
                with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
                
            }
        });
        
    }
});

//------------------floating comment-----------------------
function getX(obj) {
    var ParentObj = obj;
    var left = obj.offsetLeft;
    while (ParentObj = ParentObj.offsetParent) {
        left += ParentObj.offsetLeft;
    }
    return left;
}

function getY(obj) {
    var ParentObj = obj;
    var top = obj.offsetTop;
    while (ParentObj = ParentObj.offsetParent) {
        top += ParentObj.offsetTop;
    }
    return top;
}

var $mp_x = 0;
var $mp_y = 0;
var $hideCursor=true;
var $notOnImage=true;
    
function DisplayCoord(event) {
    var top, left, oDiv;
    oDiv = document.getElementById('tongpost_container');
    top = getY(oDiv);
    left = getX(oDiv);
    $mp_x = (event.clientX - left + document.body.scrollLeft) - 2 + $('.menu_container').width();
    $mp_y = (event.clientY - top + document.body.scrollTop) - 2;
    if($notOnImage){
        if($mp_x<800){$mp_x=800};
    }
    $mp_x=$mp_x + 'px';
    $mp_y=$mp_y + 'px';
    if(tdbg)console.log("("+$mp_x+","+$mp_y+")");
    $('#floating_cursor').attr("style", "left:" + $mp_x + ";top:" + $mp_y);
    if($hideCursor){
         $('#floating_cursor').attr("style","width:0px; height:0px; overflow:hidden;");
    }
    
}

$("#comment_input").keyup(function(event){
    if(event.keyCode == 13){
        $('#comment_submit').click();
    }
});

$('#comment_submit').click(function () {
    if(usernickname===null){
        alert("请先登录~");
        window.scrollTo(0, 0);
        return;
    }
    
    if ($mp_x == 0) {
        alert("请鼠标单击选择弹幕位置~")
        return;
    }
    if (document.getElementById('comment_input').value == "") {
        alert("快填写弹幕吧~")
        return;
    }
    var $float_comment = "{"+"\"user\":" + "\""+usernickname+"\","+
                             "\"x_pos\":" + "\""+$mp_x +"\","+
                             "\"y_pos\":" + "\""+$mp_y +"\","+
                             "\"text\":" + "\""+document.getElementById('comment_input').value+"\"}$";
    var questurl = baseurl.concat("?json=add_float_comment&id=" + $tongpost_id + "&comment=" + $float_comment);
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            if(tdbg)console.log(response);
        }
    });
    document.getElementById('comment_input').value = "";

    //add a comment to screen
    var comments = $float_comment;
    var cmarray = comments.split('$');
    for (var i = 0; i < (cmarray.length - 1); i++) {
        $commarray.push(cmarray[i]);
        cmjson = JSON.parse(cmarray[i]);
        //if(tdbg)console.log(cmjson);
        $("<h3 class='flcomment' cont='' cid='"+($commarray.length-1)+"' user='"+cmjson.user+"' style='left:" + cmjson.x_pos + ";top:" + cmjson.y_pos + "'>" + "@" + cmjson.user + ": " + cmjson.text + "</h3>").insertAfter($('#tongpost_container').find('.end'));
    }
    
    //manager float event
    $('.flcomment').hover(function () {
        if(usernickname==$(this).attr('user')){
            $(this).css('background', 'rgba(126, 128, 127, 0.67)');
            $(this).attr('cont', '(点击删除)');
        }
    },function () {
        if(usernickname==$(this).attr('user')){
            $(this).css('background', 'rgba(251, 102, 134, 0.93)');
            $(this).attr('cont', '');
        }
    });
    $('.flcomment').click(function () {
        if (usernickname==$(this).attr('user')) {
            if(tdbg)console.log($commarray[$(this).attr('cid')]);
            var $float_comment = $commarray[$(this).attr('cid')].replace(/"/g,'$');
            if(tdbg)console.log($float_comment);
            var questurl = baseurl.concat("?json=remove_float_comment&id=" + $tongpost_id + "&comment=" + $float_comment);
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    if(tdbg)console.log(response);
                }
            });
            $(this).attr("style","width:0px; height:0px; overflow:hidden;");
        }
        
    });

});

switchcomment = function () {
    if ($commenton == 1) {
        $('#comment_switch').text('弹幕OFF');
        $('#comment_switch').css("background", "#acacac");
        $('.rollingcomment_container').find('h3').css('color', 'rgba(0,0,0,0)');
        $('.rollingcomment_container').find('h3').css('background', 'rgba(0,0,0,0)');
        $commenton = 0;
    } else {
        $('#comment_switch').text('弹幕ON');
        $('#comment_switch').css("background", "#fb6686");
        $('.rollingcomment_container').find('h3').css('color', '#fff');
        $('.rollingcomment_container').find('h3').css('background', 'rgba(251, 102, 134, 0.67)');
        $commenton = 1;
    }
};

$('#comment_switch').click(switchcomment);

function onCkeydown(event) {
    //if(tdbg)console.log(String.fromCharCode(event.keyCode) );
    if (String.fromCharCode(event.keyCode) == "E") {
        switchcomment();
    }
}

var $comment_extend_swith=0;
$('#comment_icon').click(function () {
    if($comment_extend_swith){
        $('#comment_extend').attr("style","width:0px; height:0px; overflow:hidden;");
        $hideCursor=true;
        $('#floating_cursor').attr("style","width:0px; height:0px; overflow:hidden;");
        $comment_extend_swith=0;
    }else{
        $('#comment_extend').attr("style","");
        $hideCursor=false;
        $('#floating_cursor').attr("style","");
        $comment_extend_swith=1;
    }
    
});


//-----------------------------MAP api-------------------------------

var $mmarkerarray= new Array();

function mapMarkerLoader(response){
    
    post_id=response.post.id;

    $curCount = 1// response.count;
    //set post basic title info and other
    for (var i = 0; i < $curCount; i++) {

        try{
            
            if(typeof (response.post.custom_fields.mapapp) == "undefined"){
                return;
            }
            
            var mapmarkers=response.post.custom_fields.mapapp[0];

            //if(tdbg)console.log(mapmarkers);
            if(mapmarkers=="") continue;

            var mparray = mapmarkers.split('$');
            var marklist= new Array();
            for (var k = 0; k < (mparray.length-1); k++) {
                var cmjson = JSON.parse(mparray[k]);
                marklist[k]=cmjson;

            }
            $mmarkerarray[response.post.id]=marklist;
            labellist.push([response.post.id,response.post.custom_fields.originality[0],mparray.length-1]);
        }catch(err){
            if(tdbg)console.log(err);
        };
    }
//    if(tdbg)console.log($mmarkerarray);
    
    if($mmarkerarray.length>0){
        $(".xunli_map").attr("style","");
        map_initialize(); 
    }
    
}

var labellist=[];
var txtlist=[];
var markers=[];
var makerlisteners=[];
var bounds = null;
var post_id=0;

function map_makeradder(map,post_id,marker_index){

    var mstop_1= new google.maps.LatLng(Number($mmarkerarray[post_id][marker_index].Lat), Number($mmarkerarray[post_id][marker_index].Lng));
    var marker_1 = new google.maps.Marker({
        position: mstop_1,
        map:map,
        title: "loc_1",
        icon: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Flag-4-Left-Pink-icon.png"
    });
    markers.push(marker_1);
    bounds.extend(marker_1.position);
    
    var mstring_1= "<div class='markerinfo'>"+$mmarkerarray[post_id][marker_index].Content +"</div>"+"<img src='"+$mmarkerarray[post_id][marker_index].Img.replace(getRegBaseUrl(), cdnurl) +"' height='180px' >";
    var minfo_1 = new google.maps.InfoWindow({
        content:mstring_1
    });
    var mlistener=google.maps.event.addListener(marker_1,'click',function(){minfo_1.open(map,marker_1)});
    makerlisteners.push(mlistener);
    
}

function map_makeradderLoop(map,post_id){
    
    if(typeof ($mmarkerarray[post_id]) == "undefined") return;
    
    for(var i=0;i<$mmarkerarray[post_id].length;i++){
        map_makeradder(map,post_id,i);
    }
    
    map.fitBounds(bounds);
    
}

function markers_clear(){
    bounds = new google.maps.LatLngBounds();
    for (var i=0;i<markers.length;i++){
        markers[i].setMap(null);
        google.maps.event.removeListener(makerlisteners[i]);
    }
    markers=[];
    makerlisteners=[];
}

function map_initialize() {

    var styleArray2 = [{"featureType":"road","stylers":[{"hue":"#9300ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"saturation":-78},{"hue":"#b100ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#b100ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#9300ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"simplified"},{"hue":"#9300ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}];

   var styleArray3 = [ { "featureType": "administrative", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "landscape", "elementType": "all", "stylers": [ { "visibility": "simplified" }, { "hue": "#0066ff" }, { "saturation": 74 }, { "lightness": 100 } ] }, { "featureType": "poi", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road.highway", "elementType": "all", "stylers": [ { "visibility": "off" }, { "weight": 0.6 }, { "lightness": "69" }, { "saturation": "-79" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road.arterial", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "transit", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "transit.line", "elementType": "all", "stylers": [ { "saturation": "77" }, { "hue": "#9300ff" }, { "lightness": "55" }, { "visibility": "on" } ] }, { "featureType": "water", "elementType": "all", "stylers": [ { "visibility": "simplified" }, { "color": "#5f94ff" }, { "lightness": 26 }, { "gamma": 5.86 } ] } ];
    
    var styleArray = [ { "featureType": "all", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "all", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.country", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "labels", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.locality", "elementType": "labels", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "landscape.natural.landcover", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "landscape.natural.terrain", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#aadd55" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "visibility": "on" }, { "hue": "#c900ff" }, { "saturation": "-100" }, { "lightness": "55" } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road.arterial", "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road.local", "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#fcfcfc" } ] } ];
    
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(38.8921418,135.4500023),
        disableDefaultUI: false,
        scrollwheel: false, 
        styles: styleArray
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
//    map_makeradderLoop(map,$(".post_wtnail").eq(0).attr('pid').toString());
    
//    $('.post_wtnail').click(function () {
//        markers_clear();
//        map_makeradderLoop(map,$(this).attr('pid').toString());
//        $("#xunliview").attr("href",$(this).find('a').attr('href'));
//        $("#xunliview").attr("style","");
//    });
    
    markers_clear();
    map_makeradderLoop(map,post_id);
    
//    for(var i=0;i<labellist.length;i++){
//        mapLabelInit(map,labellist[i][0],labellist[i][1],labellist[i][2]);
//    }
}

//
//function mapLabelInit(map,id,text,len){
//    var idstr=id.toString();
//    text=text;
//    
//    var mbounds = new google.maps.LatLngBounds();
//    for(var i=0;i<len;i++){
//        var mstop=  new google.maps.LatLng(Number($mmarkerarray[idstr][i].Lat), Number($mmarkerarray[idstr][i].Lng));
//        mbounds.extend(mstop);
//    }
//        
//    var mapLabel = new MarkerWithLabel({
//       position: mbounds.getCenter(),
//       draggable: false,
//       raiseOnDrag: false,
//       map: map,
//       icon: "images/tp.png",
//       labelContent: "<div class='lab' id='"+id+"'>"+text,
//       labelAnchor: new google.maps.Point(24, 40),
//       labelClass: "maplabels", // the CSS class for the label
//       labelStyle: {opacity: 0.85}
//     });
//    google.maps.event.addListener(mapLabel, "click", globalMakerLabelHandler);
//}
//
//function globalMakerLabelHandler() { 
//        markers_clear();
//    if(tdbg)console.log($(this.labelContent).attr('id').toString());
//    map_makeradderLoop(this.map,$(this.labelContent).attr('id').toString());
//};
//                                  
