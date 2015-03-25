var $postCount = 8,
    $pageNum = 1;
var $rankCount = 10;
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();

var $curCount = 0,
    $maxPages = 0;

$(document).ready(function () {
    updatePosts($postCount, $pageNum);
});



function updatePosts(postCount, pageNum) {
    $('.loading_cover').attr("style", "");
    var questurl = baseurl.concat("?json=get_category_posts&category_slug=post&count=" + postCount + "&page=" + pageNum);
    var $post_container = $('#index_post_container'),
        $post_cells = $post_container.find('.post_cell');

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
                $post_cells.eq(i).attr("style", "");
                //replace title
                $post_cells.eq(i).find('a').text(response.posts[i].title.substring(0, 31));
                $post_cells.eq(i).find('a').attr("href", "tongpost.html?id=" + encodeId(response.posts[i].id));
                //replace info
                try {
                    var flt_comment_count = response.posts[i].custom_fields.float_comment[0].split('$').length - 1;
                } catch (err) {
                    var flt_comment_count = 0;
                }
                $post_cells.eq(i).find('li')[0].innerHTML = "<i class='fa fa-pencil fa-fw'></i>&nbsp;" + response.posts[i].author.nickname + " <i class='fa fa-clock-o fa-fw'></i>&nbsp;" + response.posts[i].date.substring(0, 10) + " <i class='fa fa-eye fa-fw'></i>&nbsp;" + response.posts[i].custom_fields.viewer_count[0] + " <i class='fa fa-comment fa-fw'></i>&nbsp;" + flt_comment_count;
                //replace intro
                $post_cells.eq(i).find('p').text(response.posts[i].custom_fields.intro[0]);
                var $tbnlurl = response.posts[i].attachments[0].images.thumbnail.url.replace(baseurl, cdnurl);
                $post_cells.eq(i).find('img').attr('src', $tbnlurl);

                //remove addional attribute
                $post_cells.eq(i).find(".float_video_link").remove();

                //check if it is a video
                var $postCategories = response.posts[i].categories;
                for (var j = 0; j < $postCategories.length; j++) {
                    if ($postCategories[j].slug == "video") {
                        var $video_link = response.posts[i].custom_fields.video_link[0];
                        $("<div class='float_video_link' ref='" + $video_link + "' post_id=" + response.posts[i].id + "></div>").insertAfter($post_cells.eq(i).find('p'));
                        break;
                    }
                }

                //add tages into post
                $post_cells.eq(i).find(".tag").remove();
                var $postTags = response.posts[i].tags;
                for (var j = 0; j < $postTags.length; j++) {
                    $("<li class='tag'>" + $postTags[j].title + "</li>").insertBefore($post_cells.eq(i).find('#tagend'));
                }

            }

            for (var i = $curCount; i < postCount; i++) {
                $post_cells.eq(i).attr("style", "width:0px; height:0px; overflow:hidden;");
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

            $('.loading_cover').attr("style", "width:0px; height:0px; overflow:hidden;");
        }

    });

}

//control the post
$('.nextPostPage').click(function () {
    $pageNum = $pageNum + 1;
    if ($pageNum >= ($maxPages - 1)) {
        $pageNum = $maxPages;
        $('.nextPostPage').attr("style", "width:0px; height:0px; overflow:hidden;");
    }
    $('.prevPostPage').attr("style", "");
    updatePosts($postCount, $pageNum);
    pageScroll();
});

$('.prevPostPage').click(function () {
    $pageNum = $pageNum - 1;
    if ($pageNum <= 1) {
        $pageNum = 1;
        $('.prevPostPage').attr("style", "width:0px; height:0px; overflow:hidden;");
    }
    $('.nextPostPage').attr("style", "");
    updatePosts($postCount, $pageNum);
    pageScroll();
});


