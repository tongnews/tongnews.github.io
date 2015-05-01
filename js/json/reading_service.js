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