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

/**
 * Returns advices that have expired time for Facebook updates on likes
 */
adviceSchema.statics.findReadyForFacebookUpdate = function (callback) {
    return this.find({nextFacebookInfoUpdateTime: {$lte:  Date.now()}}, callback);
};

/**
 * Returns array of top advices rated by facebookLikes. Takes one advice per role only
 * 
 * param skipFirst (can be ommitted) - ommit certain number of advices from the beginning of result collection
 */

adviceSchema.statics.findTop = function (qty, skipFirst, callback) {

    var mapAggregateAdvices = function() {
        emit(this.roleId, {adviceId: this._id, facebookLikes: this.facebookLikes});  
    };
    
    var reduceAggregateAdvices = function(key, values) {
        var topAdvice = {facebookLikes: 0};
        values.forEach(function(value){
            if (topAdvice.facebookLikes < value.facebookLikes) {
                topAdvice.facebookLikes = value.facebookLikes;
                topAdvice.adviceId = value.adviceId;
            }
        });
        return topAdvice;
    };
    
    var compareRoles = function(roleA, roleB) {
        if (roleA.value.facebookLikes == roleB.value.facebookLikes) {
            return 0;
        } else if (roleA.value.facebookLikes > roleB.value.facebookLikes) {
            return -1;
        } else {
            return 1;
        }
    };
      
    this.collection.mapReduce(mapAggregateAdvices.toString(),
                              reduceAggregateAdvices.toString(),
                              {out: {inline : 1},query: {facebookLikes: {$gt:0}}}, 
                              function(err, collection){
                                  
                                  var skipFirstType = Object.prototype.toString.call(skipFirst).slice(8, -1);
                                  if (skipFirstType != 'Number') {
                                      callback = skipFirst;
                                      skipFirst = 0;
                                  }
                                  
                                  if (err) {
                                      callback(err,null);
                                  } 
                                  
                                  collection = collection.sort(compareRoles);
                                  
                                  var sortedRoles = [];
                                  var maxAdviceLikesPerRole = [];
                                  
                                  var maxIndex = Math.min(skipFirst+qty-1,collection.length - 1);
                                  
                                  for (var i=skipFirst; i<=maxIndex; i++) {
                                      sortedRoles.push(collection[i]._id);
                                      maxAdviceLikesPerRole[collection[i]._id] = collection[i].value.facebookLikes;
                                  }
                                  
                                  Role.find()
                                      .$in('_id',sortedRoles)
                                      .populate('advices')
                                      .run( function(err,roles) {
                                          roles.forEach(function(role){
                                              //This strange notation value.facebookLikes is to use the same compare function as described before
                                              role.value = {facebookLikes : maxAdviceLikesPerRole[role._id]};
                                          });
                                          roles.sort(compareRoles);
                                          callback(err,roles);
                                      });
                              });
};


//TODO: Needs one more map/reduce to handle case, when Advice is deleted

/**
 * Map/Reduce to calculate aggregate statistics on Roles
 */
adviceSchema.post("save",function(){
    var mapAggregateAdvices = function() {
        emit(this.roleId, {totalFacebookLikes: this.facebookLikes});  
    };
    
    var reduceAggregateAdvices = function(key, values) {
        var result = {totalFacebookLikes: 0};
        values.forEach(function(value){
            result.totalFacebookLikes += value.totalFacebookLikes;
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
            role.hasAdvices = true;
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