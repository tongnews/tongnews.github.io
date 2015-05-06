var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $tongpost_id = 0;
var $commenton = 1;

$(document).ready(function () {
    
    //nav footer function JS
    baseJSload();
    
    console.log("Starting JSON POSTS engine for Tongpost!");
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

                console.log(response.post);

                var $tongpost_container = $('#tongpost_container');
                $tongpost_container.find('h2').text(response.post.title);
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

                //insert content
                $(response.post.content.toString().replace(getRegBaseUrl(), cdnurl)).insertAfter($tongpost_container.find('p'));
                
                //regularize image width
                var imgset = $tongpost_container.find('img');
                for (var k=0; k<imgset.length ;k++){
                    var aspratio = imgset.eq(k).attr('height')/imgset.eq(k).attr('width');
                    imgset.eq(k).attr('width',600+'px');
                    imgset.eq(k).attr('height',600*aspratio+'px');
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
                            $($videolink[linktype]).insertAfter($tongpost_container.find('.intro'));
                            $tongpost_container.find('iframe').attr("style", "");
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
                    $("<li class='tag'>" + $postTags[j].title + "</li>").insertBefore($tongpost_container.find('#tagend'));
                }

                //add comments
                try {
                    var comments = response.post.custom_fields.float_comment[0];
                    var cmarray = comments.split('$');
                    var cmarray = comments.split('$');
                    for (var i = 0; i < (cmarray.length - 1); i++) {
                        cmjson = JSON.parse(cmarray[i]);
                        //console.log(cmjson);
                        $("<h3 class='flcomment' style='left:" + cmjson.x_pos + ";top:" + cmjson.y_pos + "'>" + "@" + cmjson.user + ": " + cmjson.text + "</h3>").insertAfter($('#tongpost_container').find('.end'));
                    }
                        
                    //manager float event
                    $('.flcomment').click(function () {
                        if (getManagerlogin()) {
                            $(this).css('background', 'rgba(102, 251, 154, 0.67)');
                        }
                    });
                } catch (err) {};
                
                //control image hover
                $('p').hover(function () {
                    if($(this).find("img").length>0){
                        $notOnImage=false;
                    };
                },function () {
                    $notOnImage=true;
                });
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
    console.log("("+$mp_x+","+$mp_y+")");
    $('#floating_cursor').attr("style", "left:" + $mp_x + ";top:" + $mp_y);
    if($hideCursor){
         $('#floating_cursor').attr("style","width:0px; height:0px; overflow:hidden;");
    }
    
}

$('#comment_submit').click(function () {
    if(usernickname===null){
        alert("请先登录~")
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
            console.log(response);
        }
    });
    document.getElementById('comment_input').value = "";

    //add a comment to screen
    var comments = $float_comment;
    var cmarray = comments.split('$');
    for (var i = 0; i < (cmarray.length - 1); i++) {
        cmjson = JSON.parse(cmarray[i]);
        //console.log(cmjson);
        $("<h3 class='flcomment' style='left:" + cmjson.x_pos + ";top:" + cmjson.y_pos + "'>" + "@" + cmjson.user + ": " +cmjson.text + "</h3>").insertAfter($('#tongpost_container').find('.end'));
    }

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
    //console.log(String.fromCharCode(event.keyCode) );
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