"use strict";

var User = db.model("User");
var logger = app.set("logger");

function saveRedirectUriToSession (req, res, next) {
    if ('redirectUri' in req.query) {
        var decodedUri = decodeURIComponent(req.query.redirectUri);
        logger.info("Saving redirectUri " + decodedUri + " to session");
        req.session.redirectUri = decodedUri;
    }
    next();
    return;
}

function redirectToSavedUri(req, res, next) {
    if ('redirectUri' in req.session &&
        req.session.redirectUri !== '') {
        var uriToRedirect = req.session.redirectUri;
        req.session.redirectUri = '';
        logger.debug("Redirecting to URI set in session: " + uriToRedirect);
        res.redirect(uriToRedirect);
        return;
    } else {
        logger.debug("No redirect URI set in session, redirecting to home page");
        res.redirect("/");
        return;
    }
}

/**
 * Shows login box depending on isLogin status
 */
module.exports = function(app, securityManager) {
    
    function requireAuth(req, res, next) {
        var args = [];
        args.push(req);
        args.push(res);
        args.push(next);
        securityManager.requireAuth.apply(securityManager, args);
    }

	app.post('/myaccount/loginbox', function(req,res,next){
        var redirectUri = "/";
        if (req.query && ('redirectUri' in req.query) && req.query.redirectUri.indexOf("%") === 0) {
            redirectUri = decodeURIComponent(req.query.redirectUri);
        }
        if (securityManager.isLoggedIn(req)) {
            res.render('myaccount/loginbox/hello.ejs', {layout: 'layout_ajax.ejs',
                                                        redirectUri: encodeURIComponent(redirectUri),
                                                        userName: req.session.userName});
            return;
        } else {
	        res.render('myaccount/loginbox/login.ejs', {layout: 'layout_ajax.ejs', redirectUri: encodeURIComponent(redirectUri)});
            return;
	    }
	});

    /**
     * Login action that relies heavily on saving redirectUrl to session and Facebook authentication
     */
	app.get('/myaccount/login', saveRedirectUriToSession, requireAuth, function(req, res, next) {
        logger.info("Redirection from /login action, assuming that Facebook operations are completed");
        redirectToSavedUri(req, res, next);
    });

    /**
     * Logout user, that effectively remove Facebook id from session
     */
    app.get('/myaccount/logout', saveRedirectUriToSession, function(req, res, next) {
        logger.info("User with id=" + req.session.userId + "is no more attached to session. Redirection from /logout action.");
        req.session.userId = null;
        redirectToSavedUri(req, res, next);
    });

};