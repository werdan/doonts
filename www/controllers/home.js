var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

var RolesOnHomePage = 10;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
	    Role.findTop(RolesOnHomePage,function(err,roles){
	        if (err) {
	            next(new Error(err));
	            return
	        } 	        
	        res.render('home/home.ejs',{roles: roles});
	    });
	});
};