var Schema = db.Schema, ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	uid     : Number,
    first_name  : String,
    last_name 	: String,
    gender		: String,
    locale		: String
}, { strict: true });

userSchema.statics.findByUID = function (uid, callback) {
	return this.findOne({
		uid : uid
	}, callback);
};

exports.User = db.model('User', userSchema);