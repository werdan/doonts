var User = db.model("User");
var url = require("url");
var logger = app.set("logger");

var SecurityManager = function(facebookAPI) {
	//Facebook API is injected during application startup
	this.facebookAPI = facebookAPI;
};

function getRedirectUrl(req) {
	var parsedUrl = url.parse(app.set("web.unsecureUrl") + req.url);
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
		next();
		return;
	} else {
		next(new Error("No req.session object found - can not log-in user"));
	}
}

function needsAuthInfoUpdate(req) {
	if (req && req.session && req.session.userId && req.session.authInfoExpires < Date.now()) {
		return true;
	}
	return false;
};

function isValidFacebookReturnCode(code) {
	var validity = code && code.length>20;
	logger.debug("FB code \"" + code + "\" validity is: " + validity);
	return validity;
}

/**
 * There are the following parameters that influence behaviour of this method
 * 
 * isLoggedIn() 
 * needsAuthInfoUpdate()
 * isValidFacebookReturnCode()
 * result of requestAccessToken
 * 
 * So there are the following combinations to process:
 * 
 * isLoggedIn == true && needsAuthInfoUpdate == false
 * isLoggedIn == false && isValidFacebookReturnCode == false
 * isLoggedIn == false && isValidFacebookReturnCode == true
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == false
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == true && requestAccessToken -> err
 * isLoggedIn == true && needsAuthInfoUpdate == true && isValidFacebookReturnCode == true && requestAccessToken -> data
 * 
 * 
 * @param req 
 * @param res
 * @param next
 */
function requireAuth(req, res, next) {
	logger.debug("Starting user authentication process");
	if (isLoggedIn(req) && !needsAuthInfoUpdate()) {
		logger.debug("User is logged in and info is updated");
		next();
		return;
	}
	if (isValidFacebookReturnCode(req.query.code)) {
		this.authToFacebook(req, res, next);
	} else {
		logger.debug("Direct access to URL without passing by Facebook pages - redirect to page with login info");
		res.redirect("/login");
	}
};

//TODO check if we need all three params
function authToFacebook(req, res, next) {
	logger.debug("Trying to update user info on Facebook");
	options = {
		  		client_id: app.set("web.facebook.client_id"),
		  		redirect_uri : getRedirectUrl(req),
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
	console.log(data.id);
	User.findByUID(data.id, function(err, user) {
		console.log(err);
		if (err) {
			next(new Error("DB error: " + err));
		} else if (!user) {
			logger.debug("Creating new user, as user with FB id=" + data.id + " not found");
			user = new User();
		}
		user.uid = data.id;
		user.firstname = data.first_name;
		user.lastname = data.last_name;
		user.gender = data.gender;
		user.username = data.username;
		user.locale = data.locale;
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
SecurityManager.prototype.authToFacebook = authToFacebook;

module.exports = function(facebookAPI) {
	var securityManagerInstance = new SecurityManager(facebookAPI);
	return securityManagerInstance;
};