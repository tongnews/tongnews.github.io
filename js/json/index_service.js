/**
 * Created by tchann 3/3/2015
 */
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $postCount = 12,
    $pageNum = 1;
var $rankCount=10;
var $fly_video_right = 20;

var $pagenumper =12;

var $pagecur=[];
var $pagecount=[];
$pagecur["widget_news"]=1;
$pagecur["widget_activity"]=1;
$pagecur["widget_daily"]=1;
$pagecur["widget_pilgrimage"]=1;


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
    
    //if(tdbg)console.log("Starting JSON POSTS engine!");
    updateAllinOne();
    updatePosts($postCount, $pageNum);
    
    //user management
    //createCookie("user","",14);
    checkCookie();
    
});
                  
function scrollbarCustom(){
    $(".customScrollBox").mCustomScrollbar();
}

$(window).scroll(function () {
    
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-500)) {
        $('#second').css({
                position:"absolute",
                left:"inherit",
                right: "0px",
                top: "inherit",
                bottom: "0px"
        })
        
    }else{
        
        if ($(this).scrollTop() > 1700) {
            $('#second').css({
                position:"fixed",
                left: ($('#first').offset().left+$('#first').width()-320)+"px",
                rigth: "inherit",
                top: "inherit",
                bottom: "10px"
            })
        } else {
            $('#second').css({
                position:"absolute",
                left:"inherit",
                right: "0px",
                top: "0px",
            })
        }
    
    }
        
});


//--------------------------------post ----------------------------------------------

function updatePosts(postCount, pageNum) {
    
    $('.loading_cover').attr("style", "");
    
    if(pageNum<=1){
        
        try{
            var response = index_m;
            postArranger(response,postCount,"index");
            pagelinkrefresh(response.pages);
        }catch(err){
            
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
        
    }else{
    
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


//--------------------- others ---------------------------------------------------

function updateAllinOne() {
    
    try{
        var response = index_o;
        processojson(response);
    }catch(err){
        var response =null;
    }
    

    if(response==null){
        var questurl = baseurl.concat("?json=get_index_static_all_in_one_v2");
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                    processojson(response);

            }
        });
    }
    
}


function processojson(response) {

    var $slide_container = $('#sl-slider'),
        $slide_cells = $slide_container.find('.sl-slide');

    if (tdbg) console.log(response);

    //update rank and news
    rankArranger(response.ranks, 10, "index");
    $('#newscotainer_content').prepend(response.agenda.posts[0].custom_fields.content[0]);
    
    //udpate each category
    $pagecount["widget_pilgrimage"]=response.pilgrimage.pages;
 categoryWidgetArranger("widget_pilgrimage",response.pilgrimage,$pagenumper,$pagecur["widget_pilgrimage"]);
    
    $pagecount["widget_news"]=response.news.pages;
    categoryWidgetArranger("widget_news",response.news,$pagenumper,$pagecur["widget_news"]);
    
    $pagecount["widget_activity"]=response.activity.pages;
categoryWidgetArranger("widget_activity",response.activity,$pagenumper,$pagecur["widget_activity"]);
    
    $pagecount["widget_daily"]=response.daily.pages;
 categoryWidgetArranger("widget_daily",response.daily,$pagenumper,$pagecur["widget_daily"]);
    
    
    //update slides
    response = response.slides;
    var $slide_counts = 5;
    for (var i = 0; i < $slide_counts; i++) {
        //replace title
        $slide_cells.eq(i).find('p').text(response.posts[i].title);
        //replace intro
        $slide_cells.eq(i).find('h2').text(response.posts[i].custom_fields.series[0]);
        var $tbnlurl = response.posts[i].custom_fields.screen_image_url[0].replace(baseurl, cdnurl).replace(bkurl, cdnurl);
        var imgPreload = new Image();
        imgPreload.src = $tbnlurl;
        $slide_cells.eq(i).find('.bg-img-'.concat(i + 1)).css(
            'background-image', 'url(' + $tbnlurl + ')'
        );
        var att = document.createAttribute("ref");
        att.value = response.posts[i].custom_fields.linkaddr[0];
        $slide_cells.eq(i).find('.bg-img-'.concat(i + 1))[0].setAttributeNode(att);
    }
}

$('.rank_cell').hover(function () {
    for (var i = 3; i < $rankCount; i++) {
        $('#index_rank_contianer').find('.rank_cell').eq(i).find('img').attr('style', "width:0px; height:0px; overflow:hidden;");
    }
    $(this).find('img').attr('style', "");
});

$('.bg-img').click(function () {
    window.location.href = $(this).attr('ref');
});


//---------------------each catergory--------------

function  updateCategory(catslug,postCount,pageNum){
    
    switch (catslug){
            
        case "widget_news":
            var questurl = baseurl.concat("?json=get_category_posts_breif&category_slug=news&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    if(tdbg)console.log(response);
                    $pagecount["widget_news"]=response.pages;
                    categoryWidgetArranger("widget_news",response,postCount,pageNum);
                }

            });
            break;
            
        case "widget_daily":
            var questurl = baseurl.concat("?json=get_category_posts_breif&category_slug=daily&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    if(tdbg)console.log(response);
                    $pagecount["widget_daily"]=response.pages;
                    categoryWidgetArranger("widget_daily",response,postCount,pageNum);
                }

            });
            break;
        
       case "widget_activity":
            var questurl = baseurl.concat("?json=get_category_posts_breif&category_slug=activity&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    if(tdbg)console.log(response);
                    $pagecount["widget_activity"]=response.pages;
                    categoryWidgetArranger("widget_activity",response,postCount,pageNum);
                }

            });
            break;
            
       case "widget_pilgrimage":
            var questurl = baseurl.concat("?json=get_category_posts_breif&category_slug=pilgrimage&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    if(tdbg)console.log(response);
                    $pagecount["widget_pilgrimage"]=response.pages;
                    categoryWidgetArranger("widget_pilgrimage",response,postCount,pageNum);
                }

            });
            break;
    }
    
};

$('.addPostPage').click(function () {
    var cat=$(this).attr('cat');
    $pagecur[cat]=$pagecur[cat]+1;
    if ($pagecur[cat] >= $pagecount[cat]) {
        $(this).attr("style","width:0px; height:0px; overflow:hidden;")
    }
    updateCategory(cat,$pagenumper,$pagecur[cat]);
});