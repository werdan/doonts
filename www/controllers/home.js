var Advice = db.model("Advice");
var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

var RolesOnHomePage = app.set("web.homepage.rolesOnFirstLoad");
var SeoRolesOnHomePageFooter = app.set("web.homepage.seoRolesInFooter");

var compareAdvices = function(adviceA, adviceB) {
    if (adviceA.facebookLikes == adviceB.facebookLikes) {
        return 0;
    } else if (adviceA.facebookLikes > adviceB.facebookLikes) {
        return -1;
    } else {
        return 1;
    }
};

module.exports = function(app, seoFooterDataAppender) {
	app.get('/', seoFooterDataAppender, function(req, res, next) {
        Advice.findTop(RolesOnHomePage,function(err,roles){
            if (err) {
                next(new Error(err));
                return
            }
            renderHomeLayoutRoles(res, next, roles, 'home/home.ejs');
        });
	});

    app.get('/all-roles', seoFooterDataAppender, function(req, res, next) {
        Role.findAllWithAdvices(function(err,roles){
            if (err) {
                next(new Error(err));
                return
            }
            renderHomeLayoutRoles(res, next, roles, 'home/allroles.ejs');
        });
    });

    function renderHomeLayoutRoles(res, next, roles, template) {
        var rolesWithTopAdvices = [];
        var authorIds = [];
        roles.forEach(function(role){
            var sortedAdvices = role.advices.sort(compareAdvices);
            role.topAdvice = sortedAdvices[0]
            authorIds.push(sortedAdvices[0].author);
            rolesWithTopAdvices.push(role);
        });
        User.findByIds(authorIds,function(err,authors){
            if (err) {
                next(new Error(err));
                return;
            }
            var authorsWithKeys = [];
            authors.forEach(function(author) {
                authorsWithKeys[author._id] = author;
            });

            res.render(template,{roles: rolesWithTopAdvices, authors: authorsWithKeys});
        });
    }
};