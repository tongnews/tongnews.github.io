
var $rankCount = 10;
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $postCount = 8,
    $pageNum = 1;
var $fly_video_right = 20;
var $type="s"; //t for tag; s for search
var $key="";

$(document).ready(function () {
    
    //nav footer function JS
    baseJSload();
    
    $type = getUrlParam("type");
    $key = getUrlParam("key");
    updatePosts($postCount, $pageNum);
    addSliderMoveListeners();
    
    checkCookie();
});

//?json=get_tong_category_posts&category_slug=pilgrimage-post&count= +pageNum+ &cuskey=area&cusval=东京

function updatePosts(postCount, pageNum) {
    
    switch($type){
        case "s":
            var questurl = baseurl.concat("?json=get_search_results&search="+$key+"&count=" + postCount + "&page=" + pageNum);
            break;
        case "t":
            var questurl = baseurl.concat("?json=get_tag_posts&slug="+$key+"&count=" + postCount + "&page=" + pageNum);
            break;
    }
    
    //ajax for get recent post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            postArranger(response,postCount,"search")
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
    
//    if(tdbg)console.log((windowHeight + srollPos) + " "+ dbHiht);
    
    s = setTimeout(function () {
        if ((windowHeight + srollPos) >= (dbHiht-20) && $pageNum != $maxPages) {
//            if(tdbg)console.log($pageNum);
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