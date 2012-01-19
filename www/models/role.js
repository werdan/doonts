var Schema = db.Schema;

var adviceSchema = new Schema({
	// ID in Role
	id : Number,
	text : String,
	youtubeId: String,
	amazonId: String
}, {
	strict : true
});

var roleSchema = new Schema({
	uid : Number,
	name : String,
	advices : [ adviceSchema ]
}, {
	strict : true
});

roleSchema.virtual('href').get(function() {
	var urlTitle = this.get('name').toLowerCase().replace(/[\W]/g, "-");
	return app.set("web.unsecureUrl") + "/role/" + this.uid + "/" + urlTitle;
});

roleSchema.statics.findByUID = function findByUID(uid, callback) {
	return this.findOne({
		uid : uid
	}, callback);
};

module.exports.Role = db.model('Role', roleSchema);
