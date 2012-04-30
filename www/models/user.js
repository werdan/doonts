var Schema = db.Schema, ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	uid     : {type: String, unique: true},
    first_name  : String,
    last_name 	: String,
    gender		: String,
    locale		: String,
    link        : String
}, { strict: true });

userSchema.statics.findByUID = function (uid, callback) {
	return this.findOne({
		uid : uid
	}, callback);
};

userSchema.statics.findByIds = function (arrayIds, callback) {
    this.find()
        .$in('_id',arrayIds)
        .run(callback);
};

exports.User = db.model('User', userSchema);