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

var limitCharsInAdvice           = 280;


function getAdviceUIDFromURL(url) {
    var matches = url.match(/#(\d+)$/);
    if (matches && matches[1] && matches.length == 2) {
        return matches[1];
    } else {
        console.log("Error while extracting advice uid from URL: = " + url);
    }
}

jQuery(document).ready(function(){
    fillInLoginBox();
    initAnimations();
    addFooterMailto();
    initVirtualRoleOnSearchResultsPage();
    initAdviceTabs();
    initMediaLinksPanel();
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

function limitCharsAndUpdateCounter() {
    var charsInput = jQuery(".form_add_new_advice textarea").val();
    var charsLength = charsInput.length;
    if (charsLength >=limitCharsInAdvice) {
        var truncatedInput = charsInput.substring(0, limitCharsInAdvice-1);
        jQuery(".form_add_new_advice textarea").val(truncatedInput);
    }
    if (limitCharsInAdvice-charsLength >= 0 ) {
        jQuery(".charsLeft").html(limitCharsInAdvice-charsLength);
    }
}

function initCharsLeftCounter() {
    jQuery(".form_add_new_advice textarea").keyup(function(){
        limitCharsAndUpdateCounter();
    });
}

function sendRequestViaMultiFriendSelector() {
    FB.ui({method: 'apprequests',
        message: 'Could you, please, give an advice how to be ' + window['roleName'],
        title: 'Ask your friends for an advice'
    }, function(request){
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


    //Close icon
    jQuery(".z_block_add_media_link a.close").unbind('click').click(function(event){
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
