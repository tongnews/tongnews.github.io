/**
 * Created by tchann 3/3/2015
 */
var baseurl = getBaseUrl();
var cdnurl = getCDNUrl();
var bkurl = getBkdomainUrl();

$(document).ready(function () {
    
    //nav footer function JS
    baseJSload();
    scrollbarCustom();
    
    //if(tdbg)console.log("Starting JSON POSTS engine!");
    updateCategoryThumbnail("widget_pilgrimage",8,1);
    
    //user management
    //createCookie("user","",14);
    checkCookie();
 
    
});

function scrollbarCustom(){
    $(".customScrollBox").mCustomScrollbar();
}

function  updateCategoryThumbnail(catslug,postCount,pageNum){
    
    switch (catslug){
       case "widget_pilgrimage":
            var questurl = baseurl.concat("?json=get_category_posts_breif_att&category_slug=pilgrimage&count=" + postCount + "&page=" + pageNum);
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
                    categoryTnailArranger("widget_pilgrimage",response,postCount,pageNum);
                }

            });
            break;
    }
    
};


//google.maps.event.addDomListener(window, 'load', map_initialize);
