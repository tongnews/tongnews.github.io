/**
 * Created by tchann 3/3/2015
 */
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $postCount = 7,
    $pageNum = 1;
var $rankCount = 10;
var $fly_video_right = 20;

$(document).ready(function () {
    
    //custom scroll bar
    scrollbarCustom();
    
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

function scrollbarCustom(){
    $(".customScrollBox").mCustomScrollbar();
}

function updatePosts(postCount, pageNum) {
    
    $('.loading_cover').attr("style", "");
    var questurl = baseurl.concat("?json=get_category_posts_main&category_slug=post&count=" + postCount + "&page=" + pageNum);
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
            postArranger(response,postCount,"index");
        }

    });

}

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

//---------------------------------- search button-------------------
$('.search_button').click(function () {
    if (document.getElementById('search_input').value == "") {
        alert("请填写搜索内容~")
        return;
    }
     window.open('search.html?type=s&key='+document.getElementById('search_input').value);
});


//----------------------------------  user login ----------------------------------------
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
                $(this).css('background','rgba(251, 102, 142, 0.67)');
            }
        }
    });
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
            //console.log(response);
            if (response.status == "ok") {
               $user_nonce=response.nonce;
               $(".sginbox").attr("style","");
               $(".loginbox").attr("style","width:0px; height:0px; overflow:hidden;");
               $(".loginBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
               $(".signinBtbox").attr("style","width:0px; height:0px; overflow:hidden;");
            } else {
                alert("十分抱歉，注册系统暂时关闭T0T");
                $(this).css('background','rgba(251, 102, 142, 0.67)');
            }
        }
    });
});
    
$('.user_signin_submit').click(function () {
    
    if(document.getElementById('user_sginin_pass_input').value != document.getElementById('user_sginin_pass_input2').value){
        alert("密码输入不相同");
        return;
    }
    
    var questurl = baseurl.concat("api/user/register/?username=" + document.getElementById('user_sginin_email_input').value + "&email=" +
document.getElementById('user_sginin_email_input').value + "&user_pass=" + document.getElementById('user_sginin_pass_input').value + "&display_name=" +
document.getElementById('user_sginin_nickname_input').value + "&nickname=" +
document.getElementById('user_sginin_nickname_input').value + "&nonce=" + $user_nonce);
    $(this).css('background','rgba(102, 251, 154, 0.67)');
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            console.log(response);
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
                alert("用户名或密码错误/无效OwO");
                $(this).css('background','rgba(251, 102, 142, 0.67)');
            }
        }
    });
});