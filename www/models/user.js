var Schema = db.Schema, ObjectId = Schema.ObjectId;

var userSchema = new Schema({
//Use ObjectId instead of String
	id     : String,
    name      : String
}, { strict: true });

exports.User = db.model('User', userSchema);