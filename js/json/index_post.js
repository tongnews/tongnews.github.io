/**
 * Created by tchann 3/3/2015
 */


var $postCount=7, $pageNum=1;

$(document).ready(function () {
    console.log("Starting JSON POSTS engine!");
    updateSlides();
    updatePosts($postCount,$pageNum);
    updateRank(5);
    var postid = (parseInt(getUrlParam("id"), 8) - 100000) / 9;
    console.log(postid);
    console.log((postid * 9 + 100000).toString(8));
                                 
});

var baseurl="http://54.92.122.102/wordpress/";

function updatePosts(postCount,pageNum) {
    $('.loading_cover').attr("style", "");
    var questurl = baseurl.concat("?json=get_category_posts&category_slug=post&count="+postCount+"&page="+pageNum);
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
            
            //set post basic title info and other
            for (var i = 0; i < postCount; i++) {
                //replace title
                $post_cells.eq(i).find('h2').text(response.posts[i].title.substring(0,31));
                //replace info
                $post_cells.eq(i).find('h3').text("By "+response.posts[i].author.nickname+" 日期: "+response.posts[i].date.substring(0,10)+"  浏览量： "+response.posts[i].custom_fields.viewer_count[0]);
                //replace intro
                $post_cells.eq(i).find('p').text(response.posts[i].custom_fields.intro[0].substring(1, 105).concat("..."));
                var $tbnlurl = response.posts[i].attachments[0].images.thumbnail.url;
                $post_cells.eq(i).find('img').attr('src', $tbnlurl);
                
                //remove addional attribute
                $post_cells.eq(i).find(".float_video_link").remove();
                
                //check if it is a video
                var $postCategories=response.posts[i].categories;
                for (var j = 0; j < $postCategories.length ; j++){
                    if($postCategories[j].slug=="video"){
                        var $video_link=response.posts[i].custom_fields.video_link[0];
                        $("<div class='float_video_link' ref='"+$video_link+"' post_id="+response.posts[i].id+"></div>").insertAfter(                                 $post_cells.eq(i).find('p'))
                        break;
                    }
                }
            }
            
            //control click event of float video button
            $('.float_video_link').click(function () {
                var questurl = baseurl.concat("?json=view_post&id="+$(this).attr('post_id'));
                //ajax for add viewer_count for this post
                $.ajax({
                    url: questurl,
                    jsonp: "callback",
                    dataType: "jsonp",
                    data: {
                        format: "json"
                    },
                    success: function (response) {
                        console.log("viewing post "+response.post.title);
                    }
                });
                //connect to post video frame
                //console.log($(this).attr('ref'));
                $('#index_float_video_ply').find('iframe').replaceWith($(this).attr('ref'));
                $('#index_float_video_ply').find('iframe').eq(0).attr("style","");
                $('#index_float_video_ply').attr("style","");
            });
            
            $('.loading_cover').attr("style", "width:0px; height:0px; overflow:hidden;");
        }

    });

}


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
                $slide_cells.eq(i).find('.bg-img-'.concat(i+1)).css(
                    'background-image', 'url('+$tbnlurl+')'
                );
            }
        }

    });

}


//control the post video type close
$('.index_float_video_ply_close').click(function () {
    $('#index_float_video_ply').find('iframe').replaceWith('<iframe></iframe>');
    $('#index_float_video_ply').attr("style", "width:0px; height:0px; overflow:hidden;");
});

//control the post
$('.nextPostPage').click(function () {
        $pageNum=$pageNum+1;
        updatePosts($postCount,$pageNum);
        pageScroll()
});

$('.prevPostPage').click(function () {
        $pageNum=$pageNum-1;
        if($pageNum<1)$pageNum=1;
        updatePosts($postCount,$pageNum);
        pageScroll()
});

function updateRank(postCount){
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
            
            console.log(response);
            
            //set post basic title info and other
            for (var i = 0; i < postCount; i++) {
                //replace title
                $rank_cells.eq(i).find('h2').text(response.posts[i].post_title.substring(0,31));
                $("<div class='ref_id' post_id="+response.posts[i].ID+"></div>").insertAfter(                                 $rank_cells.eq(i).find('h2'))
            }
        }
    });
}

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