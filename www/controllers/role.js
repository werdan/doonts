var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

module.exports = function(app, securityManager) {
	app.get('/role/view/:roleUID/:urlTitle/:adviceId?', function(req, res, next) {
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
				res.render('role/role.ejs', 
						{role: role, rolePage: true}
				);
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
