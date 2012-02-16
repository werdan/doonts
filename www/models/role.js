var Schema = db.Schema;


var roleSchema = new Schema({
	//TODO: Add unique constraint
    uid : Number,
	name : String,
	advices : [{ type: Schema.ObjectId, ref: 'Advice' }]
}, {
	strict : true
});

roleSchema.virtual('href').get(function() {
	var urlTitle = this.get('name').toLowerCase().replace(/[\W]/g, "-");
	return app.set("web.unsecureUrl") + "/role/view/" + this.uid + "/" + urlTitle;
});

//TODO: Remove this copy/paste in all models -> use prototype
roleSchema.statics.findByUID = function (uid, callback) {
	return this.findOne(
	        {uid : uid}, 
	        callback);
};

module.exports.Role = db.model('Role', roleSchema);
