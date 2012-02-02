var Schema = db.Schema, ObjectId = Schema.ObjectId;

var logEventSchema = new Schema({
    type  			: String,
    description		: String,
    timestamp		: Number
},{ 
	    strict: true
});

exports.LogEvent = db.model('LogEvent', logEventSchema,"logs");

exports.LogEvent.FACEBOOK_HACKING_ATTEMPT = "facebook_hacking_attempt";
exports.LogEvent.USER_DENIED_APPLICATION = "user_denied_application";