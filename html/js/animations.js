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

// animations
$(document).ready(function(){
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
});

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