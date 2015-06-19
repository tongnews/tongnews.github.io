/**
 * Created by tchann 3/3/2015
 */
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

var $fly_video_right = 20;

var $pagenumper =12;

var $pagecur=[];
var $pagecount=[];
$pagecur["widget_news"]=1;
$pagecur["widget_activity"]=1;
$pagecur["widget_daily"]=1;
$pagecur["widget_pilgrimage"]=1;

$(document).ready(function () {
    
    //nav footer function JS
    baseJSload();
    
    //if(tdbg)console.log("Starting JSON POSTS engine!");
    updateCategory("widget_news",$pagenumper,$pagecur["widget_news"]);
    updateCategory("widget_activity",$pagenumper,$pagecur["widget_activity"]);
    updateCategory("widget_daily",$pagenumper,$pagecur["widget_daily"]);
    updateCategory("widget_pilgrimage",$pagenumper,$pagecur["widget_pilgrimage"]);
    //user management
    //createCookie("user","",14);
    checkCookie();
 
});


$('.nextPostPage').click(function () {
    var cat=$(this).attr('cat');
    $pagecur[cat]=$pagecur[cat]+1;
    if ($pagecur[cat] >= $pagecount[cat]) {
        $pagecur[cat] = $pagecount[cat];
    }
    $('#'+cat).find('.post_widget').remove();
    updateCategory(cat,$pagenumper,$pagecur[cat]);
});

$('.prevPostPage').click(function () {
    var cat=$(this).attr('cat');
    $pagecur[cat]=$pagecur[cat]-1;
    if ($pagecur[cat] <= 1) {
        $pagecur[cat] = 1;
    }
    $('#'+cat).find('.post_widget').remove();
    updateCategory(cat,$pagenumper,$pagecur[cat]);
});


$('.addPostPage').click(function () {
    var cat=$(this).attr('cat');
    $pagecur[cat]=$pagecur[cat]+1;
    if ($pagecur[cat] >= $pagecount[cat]) {
        $(this).attr("style","width:0px; height:0px; overflow:hidden;")
    }
    updateCategory(cat,$pagenumper,$pagecur[cat]);
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