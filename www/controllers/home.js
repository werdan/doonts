var Advice = db.model("Advice");
var User = db.model("User");
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
            var authorIds = [];
            roles.forEach(function(role){
	            var sortedAdvices = role.advices.sort(compareAdvices);
	            role.topAdvice = sortedAdvices[0]
                authorIds.push(sortedAdvices[0].author);
	            rolesWithTopAdvices.push(role);
	        });
            User.findByIds(authorIds,function(err,authors){
                var authorsWithKeys = [];
                authors.forEach(function(author) {
                    authorsWithKeys[author._id] = author;
                });
                res.render('home/home.ejs',{roles: rolesWithTopAdvices, authors: authorsWithKeys});
            });
        });
	});
};