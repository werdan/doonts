var User = require("../models/user").User;

function secureRequest(req, res, next) {
	if (User.isLoggedIn() && !User.needsAuthInfoUpdate()) {
		next();
		return;
	}
	authManager = app.set("authManager");
	authManager.auth(req, next);
}

exports.secureRequest = secureRequest;