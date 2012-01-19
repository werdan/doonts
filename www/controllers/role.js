var Role = require("../models/role").Role;
var User = require("../models/user").User;

module.exports = function(app) {
	app.get('/role/:roleUID/:urlTitle/:adviceId?', function(req, res, next) {
		Role.findByUID(req.params.roleUID, function(err, role) {
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

	app.get('/role/create', secureRequest, function(req,res, next){
		res.render('role_create.ejs');
	});
	
	app.post('/role/update/:roleUID', function(req,res, next){
		Role.findByUID(req.params.roleUID, function(err, role) {
			if (err) {
				next(new Error(err));
				return
			} else if (!role) {
				next(new Error("Role id=" + req.params.roleUID + " was not found"));
				return;
			} else {
				role.name = req.params.name;
				console.log("Updating with role.name = " + role.name);
				role.save(function(err){
					if (err) {console.log(err);}
					console.log("Role id = " + role.uid + " is updated");
					res.redirect('/role/' + role.uid + '/' + role.urlTitle);
				});
			}
		});
	});
	
};
