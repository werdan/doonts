var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

module.exports = function(app) {
	app.get('/role/view/:roleUID/:urlTitle/:adviceId?', function(req, res, next) {
		Role.findByUID(req.params.roleUID)
		    .populate('advices')
		    .run(function(err, role) {
			if (err) {
				next(new Error(err));
				return
			} else if (!role) {
				next(new Error("Role id=" + req.params.roleUID + " was not found"));
				return;
			} else {
				res.render('role.ejs', 
						{role: role}
				);
			}
		});
	});
};