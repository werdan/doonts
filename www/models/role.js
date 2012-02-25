var Schema = db.Schema;


var roleSchema = new Schema({
	//TODO: Add unique constraint
    uid : Number,
	name : String,
	advices : [{ type: Schema.ObjectId, ref: 'Advice' }],
    totalFacebookLikes: Number
}, {
//	strict : true
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

roleSchema.statics.findTop = function (qty, skipFirst, callback) {
    var skipFirstType = Object.prototype.toString.call(skipFirst).slice(8, -1);
    var query = this.find();
    if (skipFirstType == 'Number') {
        query = query.skip(skipFirst);
    } else {
        callback = skipFirst;
    }
    query.desc('totalFacebookLikes')
                 .limit(qty)
                 .run(callback);
};


module.exports.Role = db.model('Role', roleSchema);
