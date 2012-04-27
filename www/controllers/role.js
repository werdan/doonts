var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

module.exports = function(app, securityManager, seoFooterDataAppender) {
	app.get('/role/view/:roleUID/:urlTitle/:adviceId?', seoFooterDataAppender, function(req, res, next) {
		Role.findByUID(req.params.roleUID)
		    .populate('advices')
		    .run(function(err, role) {
			if (err) {
				next(new Error(err));
				return;
			} else if (!role) {
				next(new Error("Role id=" + req.params.roleUID + " was not found"));
				return;
			} else {
               fillInAuthors(role, next, function(authors){
                    res.render('role/role.ejs',
                        {role: role,
                        rolePage: true,
                        authors: authors}
                    );
                });
			}
		});
	});

	app.post('/role/update/:roleUID', securityManager.requireAuth, function(req,res, next){
		Role.findByUID(req.params.roleUID, function(err, role) {
			if (err) {
				next(new Error(err));
				return
			} else if (!role) {
				next(new Error("Role id=" + req.params.roleUID + " was not found"));
				return;
			} else {
				role.name = req.params.name;
				logger.info("Updating with role.name = " + role.name);
				role.save(function(err){
					if (err) {logger.error(err);}
					logger.info("Role id = " + role.uid + " is updated");
					res.redirect('/role/' + role.uid + '/' + role.urlTitle);
				});
			}
		});
	});
};


function fillInAuthors(role, next, callback) {
    var authorIds = new Array();
    role.advices.forEach(function(advice){
        authorIds.push(advice.author);
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
        callback(authorsWithKeys);
    });
}