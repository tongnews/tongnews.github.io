/**
 * Created by tchann 3/3/2015
 */


$(document).ready(function () {
    console.log("Starting JSON POSTS engine!");
    updatePosts();
    var postid = (parseInt(getUrlParam("id"), 8) - 100000) / 9;
    console.log(postid);
    console.log((postid * 9 + 100000).toString(8));
});

var $post_container = $('#index_post_container'),
    $post_cells = $post_container.find('.post_cell');

function updatePosts() {

    var questurl = "http://54.92.122.102/wordpress/?json=get_recent_posts";
    //ajax for get recent post
    $.ajax({
        url: questurl,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {

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