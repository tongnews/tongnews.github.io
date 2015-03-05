function getUrlParam(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function ReSizePic(ThisPic,RePicWidth){

    //============以下代码请勿修改==================================

    var TrueWidth = ThisPic.width;    //图片实际宽度
    var TrueHeight = ThisPic.height;  //图片实际高度
    var Multiple = TrueWidth / RePicWidth;  //图片缩小(放大)的倍数

    ThisPic.width = RePicWidth;  //图片显示的可视宽度
    ThisPic.height = TrueHeight / Multiple;  //图片显示的可视高度
}

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function pageScroll() {
    window.scrollBy(0,-800);
    scrolldelay = setTimeout('pageScroll()',1000);
    if(document.documentElement.scrollTop==0) clearTimeout(scrolldelay);
}


//e.g.
//<img src="http://img208.poco.cn/mypoco/myphoto/20110702/19/56945956201107021915139206804535901_001.jpg" onload="ReSizePic(this);">