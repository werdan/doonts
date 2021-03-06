"use strict";

var Schema = db.Schema;
var solrUpdaterPlugin = require('./plugins/solrUpdaterPlugin.js');

var roleSchema = new Schema({
	//TODO: Add unique constraint
    uid : {type: Number, unique: true},
    name : {type: String, validate: [roleTextValidator, 'Role text length']},
    author: {type: Schema.ObjectId, ref: 'User'},
	advices : [{ type: Schema.ObjectId, ref: 'Advice' }],
	hasAdvices: {type: Boolean, default: false},
    totalMedia: {type: Number, default: 0},
    totalFacebookLikes: {type: Number, default: 0},
    timestampCreated: {type: Number, default: Date.now}
}, {
	strict : true
});

function roleTextValidator(roleText) {
    return roleText.length != 0;
}

roleSchema.plugin(solrUpdaterPlugin);

roleSchema.virtual('href').get(function() {
	var urlTitle = this.get('name').toLowerCase().replace(/[\W]/g, "-");
	return app.set("web.unsecureUrl") + "/role/view/" + this.uid + "/" + urlTitle;
});

roleSchema.virtual('capFirstName').get(function() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
});


/**
 * This is necessary to establish common interface for solr client plugin
 */
roleSchema.methods.getRole = function (callback) {
    callback(this);
};

//TODO: Remove this copy/paste in all models -> use prototype
roleSchema.statics.findByUID = function (uid, callback) {
	return this.findOne(
	        {uid : uid}, 
	        callback);
};

roleSchema.statics.getSecretKeyForName = function(roleName) {
    var systemSalt = app.set('web.roleCreation.secretKeySalt');

    var shasum = require('crypto').createHash('sha1');
    shasum.update(roleName + systemSalt);
    return shasum.digest('hex');
}


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
                 .run(callback);
};

roleSchema.statics.findAllWithAdvices = function (callback) {
    this.find()
        .desc('totalFacebookLikes')
        .populate('advices')
        .where('hasAdvices',true)
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
