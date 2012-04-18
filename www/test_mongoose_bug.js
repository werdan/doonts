db = require('mongoose');
db.connect('mongodb://localhost/test');

var Schema = db.Schema, ObjectId = Schema.ObjectId;

var roleSchema = new Schema({
	_id     : { type: Number, unique: true },
    age : {type: Number}
}, { strict: true });

var Role = db.model('Role', roleSchema, "roles");
//Role.remove({},{});
Role.create({_id: 143, age: 30}, function(){});

Role.findOne({},function(err, role) {
	if (role) {
		role.age = 32;
		role.save(function(err){
			if (err) {console.log(err); return;};
			console.log("Role id = " + role._id + " is updated");
		});
	}
});

