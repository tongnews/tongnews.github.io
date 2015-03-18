var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $tongpost_id = 0;
var $commenton = 1;

$(document).ready(function () {
    console.log("Starting JSON POSTS engine for Tongpost!");

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
                $(response.post.content).insertAfter($tongpost_container.find('p'));
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
                    for (var i = 0; i < (cmarray.length - 1); i++) {
                        cmsubarray = cmarray[i].split(']');
                        coord2 = cmsubarray[0].substring(1);
                        coordxy = coord2.split(",");
                        console.log(cmsubarray[1]);
                        $("<h3 class='flcomment' style='left:" + coordxy[0] + ";top:" + coordxy[1] + "'>" + cmsubarray[1] + "</h3>").insertAfter($tongpost_container.find('.end'));
                    }
                    //manager float event
                    $('.flcomment').click(function () {
                        if (getManagerlogin()){
                            $(this).css('background','rgba(102, 251, 154, 0.67)');
                         }
                    });
                } catch (err) {};

            }
        });
    }
});

//floating comment
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

function DisplayCoord(event) {
    var top, left, oDiv;
    oDiv = document.getElementById('tongpost_container');
    top = getY(oDiv);
    left = getX(oDiv);
    $mp_x = (event.clientX - left + document.body.scrollLeft) - 2 + 'px';
    $mp_y = (event.clientY - top + document.body.scrollTop) - 2 + 'px';
    //console.log("("+$mp_x+","+$mp_y+")");
    $('#floating_cursor').attr("style", "left:" + $mp_x + ";top:" + $mp_y);
}

$('#comment_submit').click(function () {
    if ($mp_x == 0) {
        alert("请鼠标单击选择弹幕位置~")
        return;
    }
    if (document.getElementById('comment_input').value == "") {
        alert("快填写弹幕吧~")
        return;
    }
    var $float_comment = "[" + $mp_x + "," + $mp_y + "]" + document.getElementById('comment_input').value + "$";
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
        cmsubarray = cmarray[i].split(']');
        coord2 = cmsubarray[0].substring(1);
        coordxy = coord2.split(",");
        console.log(cmsubarray[1]);
        $("<h3 class='flcomment' style='left:" + coordxy[0] + ";top:" + coordxy[1] + "'>" + cmsubarray[1] + "</h3>").insertAfter($('#tongpost_container').find('.end'));
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

//user login
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
            }
        }
    });
});