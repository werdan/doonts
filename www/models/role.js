"use strict";

var Schema = db.Schema;

var roleSchema = new Schema({
	//TODO: Add unique constraint
    uid : Number,
	name : String,
    author: [{type: Schema.ObjectId, ref: 'User'}],
	advices : [{ type: Schema.ObjectId, ref: 'Advice' }],
	hasAdvices: {type: Boolean, default: false},
    totalFacebookLikes: Number
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

/**
 * Return collection of top roles rated by totalFacebookLikes. 
 * 
 * param skipFirst (can be ommitted) - ommit certain number of roles from the beginning of result collection
 */

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
                 .where('hasAdvices',true)
                 .populate('advices')
                 .populate('author')
                 .run(callback);
};

roleSchema.pre("save",function(next){
    if (this.advices.length > 0) {
        this.hasAdvices = true;
    } else {
        this.hasAdvices = false;
    }
    next();
});


module.exports.Role = db.model('Role', roleSchema);
