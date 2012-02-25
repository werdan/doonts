var Schema = db.Schema;
var Role = db.model("Role");
var ObjectID = require('mongodb').BSONPure.ObjectID;
var logger = app.set("logger");

var adviceSchema = new Schema({
	// ID in Role
    roleId : Schema.ObjectId,
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

adviceSchema.methods.getRole = function (callback) {
    return Role.findById(this.roleId,callback);
};

adviceSchema.statics.findReadyForFacebookUpdate = function (callback) {
    return this.find({nextFacebookInfoUpdateTime: {$lte:  Date.now()}}, callback);
};
/**
 * Map/Reduce to calculate aggregate statistics
 */
adviceSchema.post("save",function(){
    var mapAggregateAdvices = function() {
        emit(this.roleId, {facebookLikes: this.facebookLikes});  
    };
    
    var reduceAggregateAdvices = function(key, values) {
        var result = {totalFacebookLikes: 0};
        values.forEach(function(value){
            result.totalFacebookLikes += value.facebookLikes;
        });
        return result;
    };
    
    this.collection.mapReduce(mapAggregateAdvices.toString(),
                              reduceAggregateAdvices.toString(),
                              {out: {inline : 1}, query: {'roleId':this.roleId}}, 
                              function(err, collection){
                                  if (err) {
                                      logger.error(err);
                                      return
                                  } else if (collection.length != 1) {
                                      logger.error("Expecting collection with one item in array from Map/Reduce, got " + collection.toString());
                                  } else {
                                      updateRole(collection);
                                  }
                              });
});

function updateRole(collection) {
    Role.findById(collection[0]._id, function(err, role){
        if (err) {
            logger.error(err);
            return
        } else if(!role) {
            logger.error("Map/Reduce: Role with id=" + collection[0]._id + " not found for update");
            return
        } else {
            role.totalFacebookLikes = collection[0].value.totalFacebookLikes;
            role.save(function(err){
                if (err) {
                    logger.error(err);
                    return
                }
            });
            return
        }
    });
    return
};


module.exports.Advice = db.model('Advice', adviceSchema);