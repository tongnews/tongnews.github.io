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
    
    //nav footer function JS
    baseJSload();
    
    //console.log("Starting JSON POSTS engine!");
    updateCategory("widget_news",8,1);
    updateCategory("widget_activity",8,1);
    updateCategory("widget_daily",8,1);
    
    //user management
    //createCookie("user","",14);
    checkCookie();
 
});


//---------------------each catergory--------------

function  updateCategory(catslug,postCount,pageNum){
    
    switch (catslug){
            
        case "widget_news":
            var questurl = baseurl.concat("?json=get_category_posts&category_slug=news&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    console.log(response);
                    categoryWidgetArranger("widget_news",response,postCount,pageNum);
                }

            });
            break;
            
        case "widget_daily":
            var questurl = baseurl.concat("?json=get_category_posts&category_slug=daily&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    console.log(response);
                    categoryWidgetArranger("widget_daily",response,postCount,pageNum);
                }

            });
            break;
            
        case "widget_daily":
            var questurl = baseurl.concat("?json=get_category_posts&category_slug=daily&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    console.log(response);
                    categoryWidgetArranger("widget_daily",response,postCount,pageNum);
                }

            });
            break;
        
       case "widget_activity":
            var questurl = baseurl.concat("?json=get_category_posts&category_slug=activity&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    console.log(response);
                    categoryWidgetArranger("widget_activity",response,postCount,pageNum);
                }

            });
            break;
            
       case "widget_pilgrimage":
            var questurl = baseurl.concat("?json=get_category_posts&category_slug=pilgrimage&count=" + postCount + "&page=" + pageNum);
            //ajax for get recent post
            $.ajax({
                url: questurl,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: function (response) {
                    console.log(response);
                    categoryWidgetArranger("widget_pilgrimage",response,postCount,pageNum);
                }

            });
            break;
    }
    
};