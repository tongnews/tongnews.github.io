var baseurl = getBaseUrl();
var $tongpost_id = 0;

$(document).ready(function () {
    console.log("Starting JSON POSTS engine for Tongpost!");
    console.log(encodeId(122));

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
                $tongpost_container.find('h3').text("By " + response.post.author.nickname + " 日期: " + response.post.date + "  浏览量： " + response.post.custom_fields.viewer_count[0]);
                //replace intro
                $tongpost_container.find('p').text(response.post.custom_fields.intro[0]);
                //                var $tbnlurl = response.post.attachments[0].images.thumbnail.url;
                //                $tongpost_container.find('img').attr('src', $tbnlurl);
                
                var $postCategories = response.post.categories;
                for (var j = 0; j < $postCategories.length; j++) {
                    if ($postCategories[j].slug == "video") {
                        var $video_link = response.post.custom_fields.video_link[0];
                        $($video_link).insertAfter($tongpost_container.find('p'));
                        $tongpost_container.find('iframe').attr("style", "");
                        break;
                    }
                }
                
                //add comments
                var comments=response.post.custom_fields.float_comment[0];
                var cmarray=comments.split('$');
                for (var i = 0; i < (cmarray.length-1); i++) {
                    cmsubarray=cmarray[i].split(']');
                    coord2=cmsubarray[0].substring(1);
                    coordxy=coord2.split(",");
                    console.log(cmsubarray[1]);
                    $("<h3 class='flcomment' style='left:"+coordxy[0]+";top:"+coordxy[1]+"'>"+cmsubarray[1]+"</h3>").insertAfter($tongpost_container.find('.end'));
                }
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

var $mp_x=0;
var $mp_y=0;

function DisplayCoord(event) {
    var top, left, oDiv;
    oDiv = document.getElementById('tongpost_container');
    top = getY(oDiv);
    left = getX(oDiv);
    $mp_x = (event.clientX - left + document.body.scrollLeft) - 2 + 'px';
    $mp_y = (event.clientY - top + document.body.scrollTop) - 2 + 'px';
    //console.log("("+$mp_x+","+$mp_y+")");
    $('#floating_cursor').attr("style","left:"+$mp_x+";top:"+$mp_y);
}

$('#comment_submit').click(function () {
    var $float_comment="[" + $mp_x + "," + $mp_y + "]" + document.getElementById('comment_input').value + "$";
    var questurl = baseurl.concat("?json=add_float_comment&id="+$tongpost_id+"&comment="+$float_comment);
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
});