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
    scrollbarCustom();
    
    //console.log("Starting JSON POSTS engine!");
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
                    console.log(response);
                    categoryTnailArranger("widget_pilgrimage",response,postCount,pageNum);
                    mapMarkerLoader(response);
                }

            });
            break;
    }
    
};

var $mmarkerarray= new Array();

function mapMarkerLoader(response){
    
    $curCount = response.count;
    //set post basic title info and other
    for (var i = 0; i < $curCount; i++) {
        try{
            var mapmarkers=response.posts[i].custom_fields.mapapp[0];
            //console.log(mapmarkers);
            if(mapmarkers=="") continue;

            var mparray = mapmarkers.split('$');
            var marklist= new Array();
            for (var k = 0; k < (mparray.length-1); k++) {
                var cmjson = JSON.parse(mparray[k]);
                marklist[k]=cmjson;

            }
            $mmarkerarray[response.posts[i].id.toString()]=marklist;
        }catch(err){};
    }
    console.log($mmarkerarray);
    
    map_initialize(); 
}

var markers=[];
var makerlisteners=[];
var bounds = new google.maps.LatLngBounds();

function map_makeradder(map,post_id,marker_index){
    
    var mstop_1= new google.maps.LatLng(Number($mmarkerarray[post_id][marker_index].Lat), Number($mmarkerarray[post_id][marker_index].Lng));
    var marker_1 = new google.maps.Marker({
        position: mstop_1,
        map:map,
        title: "loc_1",
        icon: "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Flag-4-Left-Pink-icon.png"
    });
    markers.push(marker_1);
    bounds.extend(marker_1.position);
    
    var mstring_1= "<div class='markerinfo'>"+$mmarkerarray[post_id][marker_index].Content +"</div>"+"<img src='"+$mmarkerarray[post_id][marker_index].Img.replace(getRegBaseUrl(), cdnurl) +"' height='180px' >";
    var minfo_1 = new google.maps.InfoWindow({
        content:mstring_1
    });
    var mlistener=google.maps.event.addListener(marker_1,'click',function(){minfo_1.open(map,marker_1)});
    makerlisteners.push(mlistener);
    
}

function map_makeradderLoop(map,post_id){
    
    if(typeof ($mmarkerarray[post_id]) == "undefined") return;
    
    for(var i=0;i<$mmarkerarray[post_id].length;i++){
        map_makeradder(map,post_id,i);
    }
    
    map.fitBounds(bounds);
    
}

function markers_clear(){
    bounds = new google.maps.LatLngBounds();
    for (var i=0;i<markers.length;i++){
        markers[i].setMap(null);
        google.maps.event.removeListener(makerlisteners[i]);
    }
    markers=[];
    makerlisteners=[];
}

function map_initialize() {

    var styleArray2 = [{"featureType":"road","stylers":[{"hue":"#9300ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"saturation":-78},{"hue":"#b100ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#b100ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#9300ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"simplified"},{"hue":"#9300ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}];

   var styleArray = [ { "featureType": "administrative", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "landscape", "elementType": "all", "stylers": [ { "visibility": "simplified" }, { "hue": "#0066ff" }, { "saturation": 74 }, { "lightness": 100 } ] }, { "featureType": "poi", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road.highway", "elementType": "all", "stylers": [ { "visibility": "off" }, { "weight": 0.6 }, { "lightness": "69" }, { "saturation": "-79" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road.arterial", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "transit", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "transit.line", "elementType": "all", "stylers": [ { "saturation": "77" }, { "hue": "#9300ff" }, { "lightness": "55" }, { "visibility": "on" } ] }, { "featureType": "water", "elementType": "all", "stylers": [ { "visibility": "simplified" }, { "color": "#5f94ff" }, { "lightness": 26 }, { "gamma": 5.86 } ] } ];
    
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(Number($mmarkerarray["929"][0].Lat), Number($mmarkerarray["929"][0].Lng)),
        disableDefaultUI: true,
        styles: styleArray
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
    map_makeradderLoop(map,$(".post_wtnail").eq(0).attr('pid').toString());
    
    $('.post_wtnail').click(function () {
        markers_clear();
        map_makeradderLoop(map,$(this).attr('pid').toString());
    });
}



//google.maps.event.addDomListener(window, 'load', map_initialize);
