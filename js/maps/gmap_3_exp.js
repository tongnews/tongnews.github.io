

window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"><' + '/script>');
  }
  
  var modules = google.maps.modules = {};
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };
  
  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;
    apiLoad([0.009999999776482582,[[["https://mt0.gdgdocs.org/vt?lyrs=m@299000000\u0026src=api\u0026hl=zh\u0026","https://mt0.gdgdocs.org/vt?lyrs=m@299000000\u0026src=api\u0026hl=zh\u0026"],null,null,null,null,"m@299000000",["https://mts0.google.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=zh\u0026","https://mts1.google.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=zh\u0026"]],[["https://khms0.googleapis.com/kh?v=170\u0026hl=zh\u0026","https://khms1.googleapis.com/kh?v=170\u0026hl=zh\u0026"],null,null,null,1,"170",["https://khms0.google.com/kh?v=170\u0026hl=zh\u0026","https://khms1.google.com/kh?v=170\u0026hl=zh\u0026"]],[["https://mt0.gdgdocs.org/vt?lyrs=h@299000000\u0026src=api\u0026hl=zh\u0026","https://mt0.gdgdocs.org/vt?lyrs=h@299000000\u0026src=api\u0026hl=zh\u0026"],null,null,null,null,"h@299000000",["https://mts0.google.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=zh\u0026","https://mts1.google.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=zh\u0026"]],[["https://mt0.gdgdocs.org/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=zh\u0026","https://mt0.gdgdocs.org/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=zh\u0026"],null,null,null,null,"t@132,r@299000000",["https://mts0.google.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=zh\u0026","https://mts1.google.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=zh\u0026"]],null,null,[["https://cbks0.googleapis.com/cbk?","https://cbks1.googleapis.com/cbk?"]],[["https://khms0.googleapis.com/kh?v=85\u0026hl=zh\u0026","https://khms1.googleapis.com/kh?v=85\u0026hl=zh\u0026"],null,null,null,null,"85",["https://khms0.google.com/kh?v=85\u0026hl=zh\u0026","https://khms1.google.com/kh?v=85\u0026hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt/ft?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt/ft?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/vt?hl=zh\u0026","https://mt0.gdgdocs.org/vt?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt/loom?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt/loom?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt/ft?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt/ft?hl=zh\u0026"]],[["https://mt0.gdgdocs.org/mapslt/loom?hl=zh\u0026","https://mt0.gdgdocs.org/mapslt/loom?hl=zh\u0026"]]],["zh","US",null,0,null,null,"https://maps.gdgdocs.org/mapfiles/","https://csi.gdgdocs.org","https://mapsapis.gdgdocs.org","https://mapsapis.gdgdocs.org",null,"https://maps.google.com","https://gg.google.com","https://maps.gdgdocs.org/maps-api-v3/api/images/","https://www.google.com/maps",0],["https://maps.gdgdocs.org/maps-api-v3/api/js/20/10/intl/zh_ALL","3.20.10"],[281449028],1,null,null,null,null,null,"",null,null,1,"https://khms.googleapis.com/mz?v=170\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"https://mts.googleapis.com/vt/icon",[["https://mt0.gdgdocs.org/vt","https://mt0.gdgdocs.org/vt"],["https://mt0.gdgdocs.org/vt","https://mt0.gdgdocs.org/vt"],null,null,null,null,null,null,null,null,null,null,["https://mts0.google.com/vt","https://mts1.google.com/vt"],"/maps/vt",299000000,132],2,500,[null,"https://g0.gstatic.com/landmark/tour","https://g0.gstatic.com/landmark/config",null,"https://www.google.com/maps/preview/log204","","https://static.panoramio.com.storage.googleapis.com/photos/",["https://geo0.ggpht.com/cbk","https://geo1.ggpht.com/cbk","https://geo2.ggpht.com/cbk","https://geo3.ggpht.com/cbk"]],["https://www.google.com/maps/api/js/master?pb=!1m2!1u20!2s10!2szh!3sUS!4s20/10/intl/zh_ALL","https://www.google.com/maps/api/js/widget?pb=!1m2!1u20!2s10!2szh"],null,0,0,"/maps/api/js/ApplicationService.GetEntityDetails",0], loadScriptTime);
  };
  var loadScriptTime = (new Date).getTime();
  getScript("https://maps.gdgdocs.org/maps-api-v3/api/js/20/10/intl/zh_ALL/main.js");
})();
