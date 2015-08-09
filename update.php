<?php

$filepath='jcache/index_o.json';
$url = "http://bk.tongnews.org?json=get_index_static_all_in_one_v2";
$json = file_get_contents($url);
file_put_contents($filepath, 'var index_o='.$json);

$filepath='jcache/index_m.json';
$postCount=12;
$pageNum=1;
$url = "http://bk.tongnews.org?json=get_category_posts_main&category_slug=post&count=".$postCount."&page=".$pageNum;
$json = file_get_contents($url);
file_put_contents($filepath, 'var index_m='.$json);

echo 'update success';

?> 