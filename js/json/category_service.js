var $postCount = 8,
    $pageNum = 1;
var $rankCount = 10;
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();

var $curCount = 0,
    $maxPages = 0;
var $fly_video_right = 20;

$(document).ready(function () {
    updatePosts($postCount, $pageNum);
    addSliderMoveListeners();
});



function updatePosts(postCount, pageNum) {

    var questurl = baseurl.concat("?json=get_category_posts&category_slug=post&count=" + postCount + "&page=" + pageNum);
    //ajax for get recent post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {

            $curCount = response.count;
            $maxPages = response.pages;

            //set post basic title info and other
            for (var i = 0; i < $curCount; i++) {
                
                var postHtml=$('<div class="post_cell uniborder"><img><blockquote><a target="_blank"></a><li></li><tags><li id="tagend"></li></tags><p></p></blockquote></div>');
                
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
                    $("<li class='tag'>" + $postTags[j].title + "</li>").insertBefore(postHtml.find('#tagend'));
                }
                
                postHtml.appendTo('.post_cell_container');
            }

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
            $('#loading_cover').attr("style","width:0px; height:0px; overflow:hidden;");
        }

    });
    
    $(window).scroll(function(){
        checkload();
    });
}

function checkload() {
    
    var srollPos = $(window).scrollTop(); //滚动条距离顶部的高度
    var windowHeight = $(window).height(); //窗口的高度
    var dbHiht = $('body').height(); //整个页面文件的高度
    
//    console.log((windowHeight + srollPos) + " "+ dbHiht);
    
    s = setTimeout(function () {
        if ((windowHeight + srollPos) >= (dbHiht-20) && $pageNum != $maxPages) {
//            console.log($pageNum);
            $('#loading_cover').attr("style","");
            $pageNum = $pageNum + 1;
            if ($pageNum >= ($maxPages - 1)) {
                $pageNum = $maxPages;
            }
            updatePosts($postCount, $pageNum);
            
        }
    }, 500);
}

//----------------------------------video ply---------------------

//control the post video type close
$('.index_float_video_ply_close').click(function () {
    $('#index_float_video_ply').find('iframe').replaceWith('<iframe></iframe>');
    $('#index_float_video_ply').attr("style", "width:0px; height:0px; overflow:hidden;");
});

//control the post video type move
function addSliderMoveListeners() {
    document.getElementById('index_float_video_ply_move').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
    $('#index_float_video_ply_move_cover').attr("style", "width:0px; height:0px; overflow:hidden;");
}

function mouseDown(e) {
    window.addEventListener('mousemove', divMove, true);
    $('#index_float_video_ply_move_cover').attr("style", "");
}

function divMove(e) {
    var div = document.getElementById('index_float_video_ply');
    div.style.right = screen.width + 20 - e.clientX + 'px';
    $fly_video_right = div.style.right;
}