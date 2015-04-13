/**
 * Created by tchann 3/3/2015
 */


var $postCount = 7,
    $pageNum = 1;
var $rankCount = 10;
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $curCount = 0,
    $maxPages = 0;
var $fly_video_right = 20;

$(document).ready(function () {
    //console.log("Starting JSON POSTS engine!");
    getDomain();
    addSliderMoveListeners();
    updateSlides();
    updatePosts($postCount, $pageNum);
    updateRank($rankCount);
    
    //user management
    //createCookie("user","",14);
    checkCookie();

});



function updatePosts(postCount, pageNum) {
    $('.loading_cover').attr("style", "");
    var questurl = baseurl.concat("?json=get_category_posts_main&category_slug=post&count=" + postCount + "&page=" + pageNum);
    var $post_container = $('#index_post_container'),
        $post_cells = $post_container.find('.post_cell');

    //ajax for get recent post
    logTimeNow('PostJSON start');
    
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            
            logTimeNow('PostJSON back');
            
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
                var $tbnlurl = response.posts[i].custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
                $tbnlurl = $tbnlurl.replace(bkurl, cdnurl);
                
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
            
            $('.loading_cover').attr("style", "width:0px; height:0px; overflow:hidden;");
            
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
            
            logTimeNow('PostJSON end');
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

function updateSlides() {

    var questurl = baseurl.concat("?json=get_category_posts_indexslide&category_slug=slide");
    //ajax for get recent post
    var $slide_container = $('#sl-slider'),
        $slide_cells = $slide_container.find('.sl-slide');
    
    logTimeNow('SlideJSON start');
    
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {

            logTimeNow('SlideJSON back');

            var $slide_counts = 5;

            for (var i = 0; i < $slide_counts; i++) {
                //replace title
                $slide_cells.eq(i).find('p').text(response.posts[0].title);
                //replace intro
                $slide_cells.eq(i).find('h2').text(response.posts[0].custom_fields.series[0]);
                var $tbnlurl = response.posts[0].attachments[0].images.full.url.replace(baseurl, cdnurl);
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1)).css(
                    'background-image', 'url(' + $tbnlurl + ')'
                );
                var att = document.createAttribute("ref");
                att.value = response.posts[0].custom_fields.linkaddr[0];
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1))[0].setAttributeNode(att);
            }
            
            logTimeNow('SlideJSON end');
        }

    });

}

$('.bg-img').click(function () {
    window.location.href = $(this).attr('ref');
});

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


//--------------------- rank ---------------------------------------------------

function updateRank(rankCount) {
    var questurl = baseurl.concat("?json=get_rank_posts_viewer_count");
    var $rank_container = $('#index_rank_contianer'),
        $rank_cells = $rank_container.find('.rank_cell');
    
    logTimeNow('RankJSON start');
    
    //ajax for get recent post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            
            logTimeNow('RankJSON back');

            //set post basic title info and other
            for (var i = 0; i < rankCount; i++) {
                //replace title
                $rank_cells.eq(i).find('a').text(response.posts[i].post_title.substring(0, 31));
                $rank_cells.eq(i).find('a').attr("href", "tongpost.html?id=" + encodeId(response.posts[i].ID));
                $("<div class='ref_id' post_id=" + response.posts[i].ID + "></div>").insertAfter($rank_cells.eq(i).find('a'))
                    //console.log(response.posts[i].ID)   
                get_rank_image(response.posts[i].ID, $rank_cells.eq(i));
            }
            
            logTimeNow('RankJSON end');
        }
    });
}

function get_rank_image(posts_id, rank_cell) {
    var questurl = baseurl.concat("?json=get_post&id=" + posts_id);
    //ajax for add viewer_count for this post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            //console.log(response);
            var $tbnlurl = response.post.custom_fields.thumbnail_url[0].replace(baseurl, cdnurl);
            rank_cell.find('img').attr('src', $tbnlurl);
        }
    });

}

$('.rank_cell').hover(function () {
    for (var i = 3; i < $rankCount; i++) {
        $('#index_rank_contianer').find('.rank_cell').eq(i).find('img').attr('style', "width:0px; height:0px; overflow:hidden;");
    }
    $(this).find('img').attr('style', "");
});

//----------------------------------     user login ----------------------------------------
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

//---------------------------------json tutorial---------------------------------------
//    <p id="demo"></p>
//    <script>
//    var text = '{"employees":[' +
//    '{"firstName":"John","lastName":"Doe" },' +
//    '{"firstName":"Anna","lastName":"Smith" },' +
//    '{"firstName":"Peter","lastName":"Jones" }]}';
//
//    obj = JSON.parse(text);
//    document.getElementById("demo").innerHTML =
//    obj.employees[1].firstName + " " + obj.employees[2].lastName;
//    </script>
//
// Tell YQL what we want and that we want JSON
//    data: {
//        q: "select title,abstract,url from search.news where query=\"cat\"",
//        format: "json"
//    },

//ajax for get cookie
//    var questurl = baseurl.concat("api/user/generate_auth_cookie/?username=&password=");
//    $.ajax({
//        url: questurl,
//        jsonp: "callback",
//        dataType: "jsonp",
//        data: {
//            format: "json"
//        },
//        success: function (response) {
//            console.log(response);
//        }
//    });