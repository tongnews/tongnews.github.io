/**
 * Created by tchann 3/3/2015
 */


$(document).ready(function () {
    console.log("Starting JSON POSTS engine!");
    updateSlides();
    updatePosts();

    var postid = (parseInt(getUrlParam("id"), 8) - 100000) / 9;
    console.log(postid);
    console.log((postid * 9 + 100000).toString(8));
});

var baseurl="http://54.92.122.102/wordpress/";

function updatePosts() {

    var questurl = baseurl.concat("?json=get_category_posts&category_slug=post");
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
            
            //console.log(response);
            
            var $post_counts = 7;

            for (var i = 0; i < $post_counts; i++) {
                //replace title
                $post_cells.eq(i).find('h2').text(response.posts[0].title);
                //replace intro
                $post_cells.eq(i).find('p').text(response.posts[0].custom_fields.intro[0].substring(1, 87).concat("..."));
                var $tbnlurl = response.posts[0].attachments[0].images.thumbnail.url;
                $post_cells.eq(i).find('img').attr('src', $tbnlurl);
            }
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