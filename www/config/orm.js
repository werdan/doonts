module.exports = function(app){

	db = require('mongoose');
	db.connect("mongodb://" + app.set("db.host") + "/" + app.set("db.name"));

	if (app.set("db.debug") == true) {
		db.set('debug', true);
	}
	
	//Register schemas here
	require("../models/role");
	require("../models/advice");
	require("../models/user");
	require("../models/logEvent");
};