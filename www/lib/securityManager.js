var User = db.model("User");
var LogEvent = db.model("LogEvent");
var logger = app.set("logger");

var SecurityManager = function(facebookAPI) {
	//Facebook API is injected during application startup
	this.facebookAPI = facebookAPI;
};


/**
 * Require authentication main function
 * 
 * There are the following parameters that influence behaviour of this method
 * 
 * isLoggedIn() 
 * needsAuthInfoUpdate()
 * isValidFacebookReturnCode()
 * userDeniedApplication
 * result of requestAccessToken
 * 
 * So there are the following combinations to process:
 * 
 * 1) Default case for logged-in user:
 * isLoggedIn == true && needsAuthInfoUpdate == false
 * Tested
 * 
 * 2) Guest denied application request on Facebook:
 * isLoggedIn == false && isValidFacebookReturnCode == false && userDeniedApplication == true
 * Tested
 * 
 * 3) Guest went directly to site secured pages without authentication
 * isLoggedIn == false && isValidFacebookReturnCode == false && userDeniedApplication == false
 * Tested
 * 
 * 4) Guest is accepting app authentication request
 * isLoggedIn == false && isValidFacebookReturnCode == true && userDeniedApplication == false
 * Tested
 * 
 * 5) Hacking attempt
 * isLoggedIn == false && isValidFacebookReturnCode == true && userDeniedApplication == true
 * Tested
 * 
 * 6) We require user to update info and she still accepts application on Facebook
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == true 
 * Tested
 * 
 * 7) User denied application request on Facebook after a while, when we need info update
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == false && userDeniedApplication == true
 * Tested
 * 
 * 8) When we need info update on user and should redirect her to facebook pages
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == false && userDeniedApplication == false
 * 
 * 9) Hacking attempt
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == true && userDeniedApplication == true
 * 
 * 
 * @param req 
 * @param res
 * @param next
 */
function requireAuth(req, res, next) {
	logger.debug("Starting user authentication process");
	if (isLoggedIn(req) && !needsAuthInfoUpdate(req)) {
		logger.debug("User is logged in and info is up-today");
		next();
		return;
	}
	if (!userDeniedApplication(req) && isValidFacebookReturnCode(req)) {
	    this.authToFacebook(req, res, next);
		return
	} else if (userDeniedApplication(req) && isValidFacebookReturnCode(req)){
		logger.warn("Hacking attempt: both error and code from facebook are set");
		LogEvent.create({type: LogEvent.FACEBOOK_HACKING_ATTEMPT,  description:req.query.error_message,timestamp: Date.now()}, function(){
		    next(new Error("Hacking attempt: both error and code from facebook are set"));
		});
		return
	} else if (userDeniedApplication(req) && !isValidFacebookReturnCode(req)) {
		logger.warn("User denied application");
		LogEvent.create({type: LogEvent.USER_DENIED_APPLICATION,  description:req.query.error_message,timestamp: Date.now()}, function(){
		    res.redirect("/facebook?error=user_denied");
		});
		return
	} else {
		logger.warn("Direct access to \"" + req.originalUrl + "\" without passing by Facebook pages");
		/**
		 * GET -> user profile pages
		 * POST -> role/advice/etc creation
		 */
		res.redirect(getFacebookAuthRedirectURL(req.originalUrl));
		return
	}
};


function getFacebookAuthRedirectURL(url) {
    var fullUrl = prependUrlWithAppDomainName(url);
    var clientId = app.set("web.facebook.client_id");
    var fbAuthUrl = "https://www.facebook.com/dialog/oauth?client_id=" + clientId + "&redirect_uri=" + fullUrl;
    logger.debug("Prepared FB auth URL = " + fbAuthUrl);
    return fbAuthUrl;
}

function prependUrlWithAppDomainName(uri) {
    var URL = require("url"); 
	var parsedUrl = URL.parse(app.set("web.unsecureUrl") + uri);
	return parsedUrl.protocol + "//" + parsedUrl.hostname + parsedUrl.pathname;
}

function isLoggedIn(req) {
	if (req && req.session && req.session.userId) {
		logger.debug("User is logged in with userId = " + req.session.userId);
		return true;
	}
	logger.debug("User is not logged in");
	return false;
};

function logInUser(req, next, userId) {
	logger.debug("Saving user data in session for userId=" + userId);
	if (req.session) {
		req.session.userId = userId;
		req.session.authInfoExpires = Date.now() + app.set("web.authInfoTTL");
        User.findByUID(userId, function(err, user){
            if (err) {
                next(new Error(err));
                return;
            }
            req.session.userName = user.first_name + " " + user.last_name;
            next();
            return;
        });
	} else {
		next(new Error("No req.session object found - can not log-in user"));
	}
}

function needsAuthInfoUpdate(req) {
	logger.debug("Checking authInfoExpires=" + req.session.authInfoExpires + " against now()=" + Date.now());
	if (req.session.authInfoExpires < Date.now()) {
		return true;
	}
	return false;
};

function isValidFacebookReturnCode(req) {
	var validity = false;
	var code = "";
	if (req && req.query && req.query.code && req.query.code.length>20) {
		validity = true;
		code = req.query.code;
	}
	logger.debug("FB code \"" + code + "\" validity is: " + validity);
	return validity;
}

function userDeniedApplication(req) {
	if (req && req.query && req.query.error) {
		return true;
	}
	return false;
}

function authToFacebook(req, res, next) {
	logger.debug("Trying to update user info on Facebook");
	options = {
		  		client_id: app.set("web.facebook.client_id"),
		  		redirect_uri : prependUrlWithAppDomainName(req.originalUrl),
		  		client_secret : app.set("web.facebook.client_secret"),
		        code: req.query.code
			};
	var authClient = this.facebookAPI.user(null);
	var fapi = this.facebookAPI;
	authClient.requestAccessToken(options, function(err, access_token) {
		if (err) {
			next(new Error("Facebook auth error: " + err));
			return;
		} else {
			logger.debug("Facebook processed auth request successfully");
			var client = fapi.user(access_token);
			client.me.info(function(err, data){
				if (err) {
					next(new Error("Facebook error: " + err));
				} else {
					createUpdateUser(data, req, res, next);
				}
			});
		}
	});
}

function createUpdateUser(data, req, res, next) {
	logger.debug("Looking for user by id=" + data.id + " for creation/update");
	User.findByUID(data.id, function(err, user) {
		if (err) {
			next(new Error("DB error: " + err));
		} else if (!user) {
			logger.debug("Creating new user, as user with FB id=" + data.id + " not found");
			user = new User();
		}
		user.uid = data.id;
		user.first_name = data.first_name;
		user.last_name = data.last_name;
		user.gender = data.gender;
		user.locale = data.locale;
		user.link = data.link;
		user.save(function(err) {
			if (err) {
				next(new Error("DB error: " + err));
				return;
			}
			logInUser(req,next,user.uid);
		});
		
		
	});
}

//Exports
SecurityManager.prototype.requireAuth = requireAuth;
SecurityManager.prototype.isLoggedIn = isLoggedIn;
SecurityManager.prototype.authToFacebook = authToFacebook;

module.exports = function(facebookAPI) {
	return new SecurityManager(facebookAPI);
};