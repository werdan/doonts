module.exports = function(app) {
	/**
	 * Describes why we need facebook login
	 * 
	 * Handle "User denied app auth request" case
	 */
	app.get('/facebook', function(req, res, next) {
		res.render('static/login.ejs');
	});	
};
