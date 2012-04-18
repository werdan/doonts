function getAdviceUIDFromURL(url) {
    var matches = url.match(/#(\d+)$/);
    if (matches && matches[1] && matches.length == 2) {
        return matches[1];
    } else {
        console.log("Error while extracting advice uid from URL: = " + url);
    }
}
        
jQuery(document).ready(function(){
	initFB();
	initAutocomplete();
	fillInLoginBox();
});

function initAutocomplete() {
    var resultClickCb = function (data) {
        $(".as-input").val(data.attributes.name);
        $("#as-values-search-field").remove();
        $(".search-form").submit();
        return true;
    };
    
    $(".search-form input").autoSuggest(
                "/search/autocomplete", 
                {selectedItemProp: "name", 
                 searchObjProps: "name",
                 startText: "ask for advice here...",
                 asHtmlID : "search-field",
                 resultClick: resultClickCb});
}

function initFB() {
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '159891950744662', // App ID
	      channelUrl : '//doonts.lxc/channel.html', // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true  // parse XFBML
	    });

	  // Load the SDK Asynchronously
	  (function(d){ 
	     var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all.js";
	     d.getElementsByTagName('head')[0].appendChild(js);
	   }(document));
	  
	  //Listen like/unlike button clicks
	  FB.Event.subscribe('edge.create',
	          function(url) {
	              jQuery.post('/advice/like/' + getAdviceUIDFromURL(url));
	          }
	  );
      FB.Event.subscribe('edge.remove',
              function(url) {
                  jQuery.post('/advice/unlike/' + getAdviceUIDFromURL(url));
              }
      );
	};
}
	
function fillInLoginBox() {
    var pathname = window.location.pathname;
    $.post("/myaccount/loginbox",{redirectUri: pathname},function(data){
        $(".loginbox").html(data);
        $(".FBlogout").click(function(){
            FB.logout();
        });
    });
}


function youtubeThumbnailCallback(data) {
    jQuery('.youtubePreview-' + data['data']['id'] + " img").attr('src',data['data']['thumbnail']['sqDefault']);
    jQuery('.youtubePreview-' + data['data']['id'] + " span.title").html(data['data']['title']);
    jQuery('.youtubePreview-' + data['data']['id'] + " span.viewCount").html(data['data']['viewCount']);
}

function amazonPreviewCallback(data) {
    jQuery('.amazonPreview-' + data['asin'] + " img").attr('src',data['imgSrc']);
    jQuery('.amazonPreview-' + data['asin'] + " a.title").html(data['title']);
    jQuery('.amazonPreview-' + data['asin'] + " a.title").attr('href',data['url']);
    jQuery('.amazonPreview-' + data['asin'] + " .author").html(data['author']);
}
