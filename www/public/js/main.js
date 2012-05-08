// settings

var leftButtonsBoxClass          = 'left_buttons' ;
var leftButtonsBoxUpper          = '150px' ;
var leftButtonsBoxLower          = '181px' ;

var askAdviceBlockClass          = 'ask_advice' ;
var askAdviceSlidePanelClass     = 'panel_ask' ;
var askAdvicePanelClosedPosition = '-634px' ;
var askAdvicePanelOpenedPosition = '25px' ;
var askAdvicePanelSlidingTime    = 0.6 ; // sec

var fbLinkClass                  = 'fb' ;
var twLinkClass                  = 'tw' ;
var mailLinkClass                = 'mail' ;
var fbBoxClass                   = 'advice-content-fb' ;
var twBoxClass                   = 'advice-content-tw' ;
var mailBoxClass                 = 'advice-content-mail' ;
var boxToggleTime                = 0.4 ; // sec
var boxCloseTime                 = 0.3 ; // sec

var modalBackgroundClass         = 'modal-bg' ;
var modalBackgroundColor         = '#333' ;
var modalBackgroundOpacity       = 0.6 ;
var modalBackgroundSwitchTime    = 0.3 ; // sec


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
//    initAutocomplete();
    fillInLoginBox();
    initAnimations();
    addFooterMailto();
    initVirtualRoleOnSearchResultsPage();
    initAdviceTabs();
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
        console.log('Facebook init completed');
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
    var redirectUri = window.location.pathname + window.location.search;
    $.get("/myaccount/loginbox",{redirectUri: redirectUri},function(data){
        $(".login").html(data);
        $(".FBlogout").click(function(){
            FB.logout();
        });
    });
}

function youtubePreviewCallback(data) {
    jQuery('.youtubePreview-' + data['data']['id'] + " img").attr('src',data['data']['thumbnail']['sqDefault']);
    jQuery('.youtubePreview-' + data['data']['id'] + " .r_win_add a.title").html(data['data']['title']);
    jQuery('.youtubePreview-' + data['data']['id'] + " .r_win_add a.title").attr("href",data['data']['player']['default']);
}

function amazonPreviewCallback(data) {
    jQuery('.amazonPreview-' + data['asin'] + " img").attr('src',data['imgSrc']);
    jQuery('.amazonPreview-' + data['asin'] + " .r_win_add a.title").html(data['title']);
    jQuery('.amazonPreview-' + data['asin'] + " .r_win_add a.title").attr('href',data['url']);
    jQuery('.amazonPreview-' + data['asin'] + " .r_win_add .author").html(data['author']);
}

function initAnimations() {
    // open/close Ask Advice panel
    $('.'+askAdviceBlockClass+' > a').click(function(event){
        event.preventDefault();
        if( $('.'+askAdviceSlidePanelClass).hasClass('opened') ){
            turnOffModalBackground();
            closeAskPanel();
        }
        else {
            turnOnModalBackground();
            openAskPanel();
        }
    });

    // open/close fb panel
    $('.'+askAdviceSlidePanelClass+' .'+fbLinkClass).click(function(event){
        event.preventDefault();
        moveLeftButtonsUp();
        $('.'+askAdviceSlidePanelClass+' a > span').removeClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+fbLinkClass+' > span').addClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+twBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+mailBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+fbBoxClass).slideToggle(boxToggleTime*1000);
    });
    // open/close tw panel
    $('.'+askAdviceSlidePanelClass+' .'+twLinkClass).click(function(event){
        event.preventDefault();
        moveLeftButtonsUp();
        $('.'+askAdviceSlidePanelClass+' a > span').removeClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+twLinkClass+' > span').addClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+fbBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+mailBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+twBoxClass).slideToggle(boxToggleTime*1000);
    });
    // open/close mail panel
    $('.'+askAdviceSlidePanelClass+' .'+mailLinkClass).click(function(event){
        event.preventDefault();
        moveLeftButtonsUp();
        $('.'+askAdviceSlidePanelClass+' a > span').removeClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+mailLinkClass+' > span').addClass('opened');
        $('.'+askAdviceSlidePanelClass+' .'+fbBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+twBoxClass).slideUp(boxCloseTime*1000);
        $('.'+askAdviceSlidePanelClass+' .'+mailBoxClass).slideToggle(boxToggleTime*1000);
    });

    // close all when BG clicked
    $('.'+modalBackgroundClass).click(function(){
        closeAskPanel();
        turnOffModalBackground();
    });

    //AboutUs banner
    if (!$.cookie('banner_closed')) {
        $(".banner").show();
    }

    $('.banner a.close').click(function(event){
        event.preventDefault();
        $(".banner").hide(400);
        $.cookie('banner_closed',true);
    });
}

function turnOnModalBackground() {
    $('.'+modalBackgroundClass).css('background-color',modalBackgroundColor).fadeTo(modalBackgroundSwitchTime,modalBackgroundOpacity);
}

function turnOffModalBackground() {
    $('.'+modalBackgroundClass).fadeOut(modalBackgroundSwitchTime);
}

function openAskPanel() {
    $('.'+askAdviceSlidePanelClass).animate(
        {left:askAdvicePanelOpenedPosition},
        askAdvicePanelSlidingTime * 1000,
        function(){$('.'+askAdviceSlidePanelClass).addClass('opened');}
    );
}

function closeAskPanel() {
    $('.'+askAdviceSlidePanelClass+' a > span').removeClass('opened');
    $('.'+askAdviceSlidePanelClass+' .'+fbBoxClass).slideUp(boxCloseTime*1000);
    $('.'+askAdviceSlidePanelClass+' .'+twBoxClass).slideUp(boxCloseTime*1000);
    $('.'+askAdviceSlidePanelClass+' .'+mailBoxClass).slideUp(boxCloseTime*1000);
    moveLeftButtonsDown();
    $('.'+askAdviceSlidePanelClass).animate(
        {left:askAdvicePanelClosedPosition},
        askAdvicePanelSlidingTime * 1000,
        function(){$('.'+askAdviceSlidePanelClass).removeClass('opened');}
    );
}

function moveLeftButtonsUp() {
    $('.'+leftButtonsBoxClass).animate(
        {top:leftButtonsBoxUpper},
        0.3 * 1000
    );
}

function moveLeftButtonsDown() {
    $('.'+leftButtonsBoxClass).animate(
        {top:leftButtonsBoxLower},
        0.3 * 1000
    );
}

function addFooterMailto(){
    var l = "mailto:";
    var m = "@";
    jQuery("a.email").attr("href", l + "info" + m + "doonts.com");
    jQuery("a.email").html("info" + m + "doonts.com");
}

function initVirtualRoleOnSearchResultsPage() {
    jQuery("div.virtual-role div.column_advices_inside a").click(function(event){
        event.preventDefault();
        jQuery("form.virtual-role").submit();
    });
}

function initAdviceTabs() {
    jQuery("div.nav_advice ul li.latest").click(function(){
        event.preventDefault();
        jQuery("div.advices.media").hide();
        jQuery("div.advices.top").hide();
        jQuery("div.advices.latest").show();
        jQuery("div.nav_advice ul li.latest").addClass("active");
        jQuery("div.nav_advice ul li.media").removeClass("active");
        jQuery("div.nav_advice ul li.top").removeClass("active");
    });
    jQuery("div.nav_advice ul li.top").click(function(){
        event.preventDefault();
        jQuery("div.advices.media").hide();
        jQuery("div.advices.top").show();
        jQuery("div.advices.latest").hide();
        jQuery("div.nav_advice ul li.latest").removeClass("active");
        jQuery("div.nav_advice ul li.media").removeClass("active");
        jQuery("div.nav_advice ul li.top").addClass("active");
    });
    jQuery("div.nav_advice ul li.media").click(function(){
        event.preventDefault();
        jQuery("div.advices.media").show();
        jQuery("div.advices.top").hide();
        jQuery("div.advices.latest").hide();
        jQuery("div.nav_advice ul li.latest").removeClass("active");
        jQuery("div.nav_advice ul li.media").addClass("active");
        jQuery("div.nav_advice ul li.top").removeClass("active");
    });
}


