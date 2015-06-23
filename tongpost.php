<?php
$url = "http://bk.tongnews.org?json=view_post&id=".$_GET["id"] ;
$json = file_get_contents($url);
$json_data = json_decode($json, true);
$php_title = $json_data['post']['title'];
?> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">

<head>
    <meta name="description" content="痛新闻">
    <meta name="keywords" content="痛新闻,软软冰" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="images/favicon.ico">
    <?php echo '<title>痛新闻｜'.$php_title.'</title>'; ?> 
    <!--    CSS-->
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <link rel="stylesheet" type="text/css" href="css/pc_nav.css" />
    <link rel="stylesheet" type="text/css" href="css/tongpost.css" />
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <!--    JS  -->
    <script src="js/jQuery/jquery.js"></script>
    <script src="js/json/unitool.js"></script>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-64276529-1', 'auto');
        ga('send', 'pageview');
    </script>
</head>
    
<body>

    <div class="content_container">

        <div id="tongpost_body" class="tongpost_body">

            <div class="menu_container">

            </div>

            <div id="tongpost_container" class="tongpost_container uniborder" onclick='DisplayCoord(event)'>
                <blockquote>
                    <h2></h2>
                    <li></li>
                    <tags>
                        <li id="tagend"></li>
                    </tags>
                    <p class="intro"></p>
                </blockquote>

                <div class="xunli_map" style="width:0px; height:0px; overflow:hidden;">
                    <div id="map-canvas" class=""></div>
                    <a id="xunliview" target="_blank">巡礼小地图</a>
                </div>

                <div class="dashang_bar">
                    <a class="btn_dashang" href="javascript:;" title="打赏" onclick="document.getElementById('dashang_10').submit()" style="pointer-events: all;cursor: pointer;"></a>
                    <h6>朕觉得文章写得不错，特此赏你十两！</h6>

                    <form action="https://shenghuo.alipay.com/send/payment/fill.htm" method="POST" id="dashang_10" target="_blank" accept-charset="GBK" style="display: none;">
                        <input name="optEmail" type="hidden" value="2927087646@qq.com" />
                        <input name="payAmount" type="hidden" value="9.5" />
                        <input id="title" name="title" type="hidden" value="痛新闻打赏" />
                        <input id="memo" name="memo" type="hidden" value="喜欢作者的文章,希望有更好的作品~" />
                        <input name="pay" type="image" value="转账" src="http://file.arefly.com/alipay.png" />
                    </form>
                </div>


                <div id="relatedpost"></div>
                <div id="floating_cursor" class="floating_cursor"><i class="fa fa-map-marker fa-fw" style="font-size: 24px;"></i>
                </div>

                <div class="rollingcomment_container">
                    <div class="end"></div>
                </div>
            </div>


        </div>

        <div class="rollingcomment_input">
            <i class='fa fa-paint-brush' id="comment_icon"><p>来吐槽吧~</p><a></a></i>
            <div id="comment_extend" style="width:0px;height:0px;overflow:hidden;">
                <input type="text" id="comment_input">
                <h1 id="comment_submit">发送弹幕</h1>
                <h1 id="comment_switch">弹幕ON</h1>
            </div>
            <div class="bdsharebuttonbox">
                <a href="#" class="bds_more" data-cmd="more"></a>
                <a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a>
                <a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a>
                <a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a>
                <a href="#" class="bds_tieba" data-cmd="tieba" title="分享到百度贴吧"></a>
            </div>
        </div>
    </div>


    <!--JSON API for tongpost_html    -->
    <script src="js/json/tongpost_service.js"></script>
    <script src="http://ditu.google.cn/maps/api/js?sensor=false"></script>
    <!--    <script src="https://ditu.gdgdocs.org/maps/api/js?v=3.exp&sensor=false"></script>-->

    <!--    <script src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.8/src/markerwithlabel.js"></script>-->

</body>

</html>