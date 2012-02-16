var Schema = db.Schema;
var Role = db.model("Role");

var adviceSchema = new Schema({
	// ID in Role
	uid : Number,
	text : String,
	nextFacebookInfoUpdateTime: Number,
	facebookLikes: Number,
	youtubeId: String,
	amazonId: String
}, {
	strict : true
});

adviceSchema.statics.findByUID = function (uid, callback) {
    return this.findOne(
            {uid : uid}, 
            callback);
};

adviceSchema.statics.getRoleUID = function (advice, callback) {
    var _id = advice._id;
    return Role.findOne(
            {advices : {$in: [_id]}}, 
            callback);
};

adviceSchema.statics.findReadyForFacebookUpdate = function (callback) {
    return this.find({nextFacebookInfoUpdateTime: {$lte:  Date.now()}}, callback);
};


module.exports.Advice = db.model('Advice', adviceSchema);