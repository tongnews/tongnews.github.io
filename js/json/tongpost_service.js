var baseurl = getBaseUrl();

$(document).ready(function () {
    console.log("Starting JSON POSTS engine for Tongpost!");
    console.log(encodeId(122));

    var $tongpost_id = decodeIdfromAddr();

    if (!isNaN($tongpost_id)) {
        var questurl = baseurl.concat("?json=view_post&id=" + $tongpost_id);
        //ajax for add viewer_count for this post
        $.ajax({
            url: questurl,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                format: "json"
            },
            success: function (response) {
                console.log(response.post);
                var $tongpost_container = $('#tongpost_container');
                $tongpost_container.find('h2').text(response.post.title);
                //replace info
                $tongpost_container.find('h3').text("By " + response.post.author.nickname + " 日期: " + response.post.date + "  浏览量： " + response.post.custom_fields.viewer_count[0]);
                //replace intro
                $tongpost_container.find('p').text(response.post.custom_fields.intro[0]);
                //                var $tbnlurl = response.post.attachments[0].images.thumbnail.url;
                //                $tongpost_container.find('img').attr('src', $tbnlurl);
                var $postCategories = response.post.categories;
                for (var j = 0; j < $postCategories.length; j++) {
                    if ($postCategories[j].slug == "video") {
                        var $video_link = response.post.custom_fields.video_link[0];
                        $($video_link).insertAfter($tongpost_container.find('p'));
                        $tongpost_container.find('iframe').attr("style", "");
                        break;
                    }
                }
            }
        });
    }
});