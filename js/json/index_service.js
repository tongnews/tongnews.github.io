/**
 * Created by tchann 3/3/2015
 */


var $postCount = 7,
    $pageNum = 1;
var $rankCount = 5;
var baseurl = getBaseUrl();

var $curCount = 0,
    $maxPages = 0;
var $fly_video_right = 20;

$(document).ready(function () {
    //console.log("Starting JSON POSTS engine!");
    addSliderMoveListeners();
    updateSlides();
    updatePosts($postCount, $pageNum);
    updateRank($rankCount);
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
                $post_cells.eq(i).find('p').text(response.posts[i].custom_fields.intro[0].substring(1, 105).concat("..."));
                var $tbnlurl = response.posts[i].attachments[0].images.thumbnail.url;
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
                //console.log($(this).attr('ref'));
                $('#index_float_video_ply').find('iframe').replaceWith($(this).attr('ref'));
                $('#index_float_video_ply').find('iframe').eq(0).attr("style", "");
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

function updateSlides() {

    var questurl = baseurl.concat("?json=get_category_posts&category_slug=slide");
    //ajax for get recent post
    var $slide_container = $('#sl-slider'),
        $slide_cells = $slide_container.find('.sl-slide');
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {

            //console.log(response);

            var $slide_counts = 5;

            for (var i = 0; i < $slide_counts; i++) {
                //replace title
                $slide_cells.eq(i).find('p').text(response.posts[0].title);
                //replace intro
                $slide_cells.eq(i).find('h2').text(response.posts[0].custom_fields.series[0]);
                var $tbnlurl = response.posts[0].attachments[0].images.full.url;
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1)).css(
                    'background-image', 'url(' + $tbnlurl + ')'
                );
                var att = document.createAttribute("ref");
                att.value = response.posts[0].custom_fields.linkaddr[0];
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1))[0].setAttributeNode(att);
            }
        }

    });

}

$('.bg-img').click(function () {
    window.location.href = $(this).attr('ref');
});


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


function updateRank(rankCount) {
    var questurl = baseurl.concat("?json=get_rank_posts_viewer_count");
    var $rank_container = $('#index_rank_contianer'),
        $rank_cells = $rank_container.find('.rank_cell');

    //ajax for get recent post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {

            //console.log(response);

            //set post basic title info and other
            for (var i = 0; i < rankCount; i++) {
                //replace title
                $rank_cells.eq(i).find('a').text(response.posts[i].post_title.substring(0, 31));
                $rank_cells.eq(i).find('a').attr("href", "tongpost.html?id=" + encodeId(response.posts[i].ID));
                $("<div class='ref_id' post_id=" + response.posts[i].ID + "></div>").insertAfter($rank_cells.eq(i).find('a'))
                    //console.log(response.posts[i].ID)   
                get_rank_image(response.posts[i].ID, $rank_cells.eq(i));
            }
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
            var $tbnlurl = response.post.attachments[0].images.thumbnail.url;
            rank_cell.find('img').attr('src', $tbnlurl);
        }
    });

}

$('.rank_cell').hover(function () {
    for (var i = 0; i < $rankCount; i++) {
        $('#index_rank_contianer').find('.rank_cell').eq(i).find('img').attr('style', "width:0px; height:0px; overflow:hidden;");
    }
    $(this).find('img').attr('style', "");
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