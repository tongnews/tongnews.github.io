/**
 * Created by tchann 3/3/2015
 */
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $postCount = 12,
    $pageNum = 1;
var $rankCount = 10;
var $fly_video_right = 20;

$(document).ready(function () {
    
    if(getUrlParam("p")){
        $pageNum=Number(getUrlParam("p"));
        if($pageNum>1){
            $('.prevPostPage').attr("style", "");
        }
    };
    
        
    //nav footer function JS
    baseJSload();
    
    //custom scroll bar
    scrollbarCustom();
    addSliderMoveListeners();
    
    //console.log("Starting JSON POSTS engine!");
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


//--------------------------------post ----------------------------------------------

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
            pagelinkrefresh(response.pages);
        }

    });

}

$('.nextPostPage').click(function () {
    $pageNum = $pageNum + 1;
    if ($pageNum >= $maxPages) {
        $pageNum = $maxPages;
        $('.nextPostPage').attr("style", "width:0px; height:0px; overflow:hidden;");
    }
    window.location = '#!p='+$pageNum;
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
    window.location = '#!p='+$pageNum;
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
                $slide_cells.eq(i).find('p').text(response.posts[i].title);
                //replace intro
                $slide_cells.eq(i).find('h2').text(response.posts[i].custom_fields.series[0]);
                var $tbnlurl = response.posts[i].attachments[0].images.full.url.replace(baseurl, cdnurl);
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1)).css(
                    'background-image', 'url(' + $tbnlurl + ')'
                );
                var att = document.createAttribute("ref");
                att.value = response.posts[i].custom_fields.linkaddr[0];
                $slide_cells.eq(i).find('.bg-img-'.concat(i + 1))[0].setAttributeNode(att);
            }
            
            logTimeNow('SlideJSON end');
        }

    });

}

$('.bg-img').click(function () {
    window.location.href = $(this).attr('ref');
});

function pagelinkrefresh($pagemax) {
    $('.page_control').find('a').remove();
    var page_start = Math.max($pageNum - 3, 1);
    var page_end = Math.min($pageNum + 4, $pagemax);
    for (var i = page_end; i >= page_start; i--) {
        
        if(i==$pageNum){
            style='style="background-color:rgba(149, 53, 219, 0.9);color:white"';
        }else{
            style='';
        }
        
        $('<a class="pagelink" '+style+' href="index.html#!p=' + i + '">' + i + '</a>').insertAfter($('.page_control').find('.prevPostPage'));
    }

    $('.pagelink').click(function () {
        window.location.href = $(this).attr('href');
        location.reload();
    });
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


//--------------------- rank ---------------------------------------------------

function updateRank(rankCount) {
    var questurl = baseurl.concat("?json=get_rank_posts_viewer_count");
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
             rankArranger(response, rankCount, "index");
        }
    });
}

$('.rank_cell').hover(function () {
    for (var i = 3; i < $rankCount; i++) {
        $('#index_rank_contianer').find('.rank_cell').eq(i).find('img').attr('style', "width:0px; height:0px; overflow:hidden;");
    }
    $(this).find('img').attr('style', "");
});
