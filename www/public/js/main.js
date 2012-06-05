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
    fillInLoginBox();
    initPlaceholder();
    initAnimations();
    addFooterMailto();
    initVirtualRoleOnSearchResultsPage();
    initAddAdviceButton();
    initAdviceTabs();
    initMediaLinksPanel();
    focusOnAdvice();
});

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

function initFB() {
    window.fbAsyncInit = function() {
        console.log('Facebook init completed');
        FB.init({
            appId      : '159891950744662', // App ID
            channelUrl : '//doonts.com/channel.html', // Channel File
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
    if(window.fbAsyncInit && !window.fbAsyncInit.hasRun){
        window.fbAsyncInit.hasRun=true;fbAsyncInit();
    }

    closeAskPanel();
    turnOffModalBackground();
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
        closeAskPanel();
        //$('.'+askAdviceSlidePanelClass+' a > span').removeClass('opened');
        //$('.'+askAdviceSlidePanelClass+' .'+fbLinkClass+' > span').addClass('opened');
        //$('.'+askAdviceSlidePanelClass+' .'+twBoxClass).slideUp(boxCloseTime*1000);
        //$('.'+askAdviceSlidePanelClass+' .'+mailBoxClass).slideUp(boxCloseTime*1000);
        //$('.'+askAdviceSlidePanelClass+' .'+fbBoxClass).slideToggle(boxToggleTime*1000);
        sendRequestViaMultiFriendSelector();
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

function getAdviceUIDFromURL(url) {
    var matches = url.match(/#(\d+)$/);
    if (matches && matches[1] && matches.length == 2) {
        return matches[1];
    } else {
        console.log("Error while extracting advice uid from URL: = " + url);
    }
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
    jQuery("div.nav_advice ul li.latest").click(function(event){
        event.preventDefault();
        jQuery("div.advices.media").hide();
        jQuery("div.advices.top").hide();
        jQuery("div.advices.latest").show();
        jQuery("div.nav_advice ul li.latest").addClass("active");
        jQuery("div.nav_advice ul li.media").removeClass("active");
        jQuery("div.nav_advice ul li.top").removeClass("active");
    });
    jQuery("div.nav_advice ul li.top").click(function(event){
        event.preventDefault();
        jQuery("div.advices.media").hide();
        jQuery("div.advices.top").show();
        jQuery("div.advices.latest").hide();
        jQuery("div.nav_advice ul li.latest").removeClass("active");
        jQuery("div.nav_advice ul li.media").removeClass("active");
        jQuery("div.nav_advice ul li.top").addClass("active");
    });
    jQuery("div.nav_advice ul li.media").click(function(event){
        event.preventDefault();
        jQuery("div.advices.media").show();
        jQuery("div.advices.top").hide();
        jQuery("div.advices.latest").hide();
        jQuery("div.nav_advice ul li.latest").removeClass("active");
        jQuery("div.nav_advice ul li.media").addClass("active");
        jQuery("div.nav_advice ul li.top").removeClass("active");
    });
}

function limitCharsAndUpdateCounter(ADVICE_MAX_LENGTH) {
    var charsInput = jQuery(".form_add_new_advice textarea").val();
    var charsLength = charsInput.length;
    if (charsLength >= ADVICE_MAX_LENGTH) {
        var truncatedInput = charsInput.substring(0, ADVICE_MAX_LENGTH-1);
        jQuery(".form_add_new_advice textarea").val(truncatedInput);
    }
    if (ADVICE_MAX_LENGTH-charsLength >= 0 ) {
        jQuery(".charsLeft").html(ADVICE_MAX_LENGTH-charsLength);
    }
}

function initCharsLeftCounter(ADVICE_MAX_LENGTH) {
    jQuery(".form_add_new_advice textarea").keyup(function(){
        limitCharsAndUpdateCounter(ADVICE_MAX_LENGTH);
    });
}

function sendRequestViaMultiFriendSelector() {
    FB.ui({method: 'send',
        link: window.location.href,
    }, function(request){
        closeAskPanel();
        turnOffModalBackground();
    });
}

function initMediaLinksPanel() {
    jQuery("a.link_youtube").click(function(event){
        addMediaLinkPanel('youtube');
    });

    jQuery("a.link_amazon").click(function(event){
        addMediaLinkPanel('amazon');
    });
}

function addMediaLinkPanel(type) {
    event.preventDefault();
    turnOnModalBackground();
    jQuery("#mediaType").val(type);
    jQuery(".z_block_add_media_link input.userinput").val(jQuery("#mediaLink").val());
    jQuery(".z_block_add_media_link").show();
    jQuery(".z_block_add_media_link .icon").removeClass().addClass("link_" + type).addClass("icon");
    jQuery(".z_block_add_media_link p").html(type + " link");
    jQuery(".z_block_add_media_link input.userinput").focus();


    //Close icon and "Add media" button
    jQuery(".z_block_add_media_link .button_add_media").unbind('click').click(function(event){
        event.preventDefault();
        jQuery("#mediaLink").val(jQuery(".z_block_add_media_link input.userinput").val());
        jQuery(".z_block_add_media_link").hide();
        if (jQuery("#mediaLink").val().length > 0) {
            jQuery("div.block_add_media_link a").first().removeClass().addClass("link_" + type);
            jQuery("div.block_add_media_link").show();
        }
        turnOffModalBackground();
    });

    //Delete button
    jQuery("a.delete_addition").unbind('click').click(function(event){
        event.preventDefault();
        jQuery("#mediaType").val("");
        jQuery("#mediaLink").val("");
        jQuery("div.block_add_media_link").hide();
    });
}

function initAddAdviceButton() {
    jQuery("div.add_advice").click(function(event){
        event.preventDefault();
        jQuery(".form_add_new_advice textarea").focus();
        closeAskPanel();
        turnOffModalBackground();
    });

    jQuery("div.form_add_new_advice input.submit_form").click(function(event){
        if (jQuery(".form_add_new_advice textarea").val().length == 0) {
            event.preventDefault();
        }
    });
}

function focusOnAdvice() {
    var adviceId = window.location.search.substring(8);
    jQuery("div#" + adviceId).attr("tabindex",-1).focus();
}

function initPlaceholder() {
    jQuery('input[placeholder], textarea[placeholder]').placeholder();
}
