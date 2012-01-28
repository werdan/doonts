module.exports = function(app) {
	app.get('/login', function(req, res, next) {
		res.render('static/login.ejs');
	});	
};
