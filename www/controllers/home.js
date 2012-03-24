var Advice = db.model("Advice");
var logger = app.set("logger");

var RolesOnHomePage = app.set("web.homepage.rolesOnFirstLoad");

var compareAdvices = function(adviceA, adviceB) {
    if (adviceA.facebookLikes == adviceB.facebookLikes) {
        return 0;
    } else if (adviceA.facebookLikes > adviceB.facebookLikes) {
        return -1;
    } else {
        return 1;
    }
};

module.exports = function(app) {
	app.get('/', function(req, res, next) {
	    Advice.findTop(RolesOnHomePage,function(err,roles){
	        if (err) {
	            next(new Error(err));
	            return
	        } 	
	        var rolesWithTopAdvices = [];
	        roles.forEach(function(role){
	            var sortedAdvices = role.advices.sort(compareAdvices);
	            role.topAdvice = sortedAdvices[0];
	            rolesWithTopAdvices.push(role);  
	        });
	        res.render('home/home.ejs',{roles: rolesWithTopAdvices});
	    });
	});
};