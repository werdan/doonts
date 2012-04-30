var Advice = db.model("Advice");
var logger = app.set("logger");

function update(advice,fbapi) {
    advice.getRole(function(err,role){
        if (err) {
            logger.error(err);
            return
        } else if (!role) {
            logger.error("Advice uid: " + advice.uid + " has no role associated");
            return
        } else {
            getTotalLikeCountFromFacebook(advice, role, fbapi, function(data) {
                if ((!data.data[0] || !data.data[0].total_count) && data.data[0].total_count !== 0) {
                    logger.error("FQL on total count returned unexpected result: " + data.toString());
                    return
                }
                advice.facebookLikes = data.data[0].total_count;
                var adviceInfoTTL = app.set("web.adviceInfoTTL");
                advice.nextFacebookInfoUpdateTime = Date.now() + adviceInfoTTL;
                advice.save(function(err){
                    if (err) {
                        logger.error(err);
                        return
                    } else {
                        logger.info("Advice uid: " + advice.uid + " updated info from Facebook");
                        return
                    }
                });
            });
        }
    });
}

function getTotalLikeCountFromFacebook(advice, role, fbapi, callback) {
    var adviceUrl = role.href + "#" + advice.uid;
    var fql = "SELECT total_count FROM link_stat WHERE url=\"" + adviceUrl + "\"";
    var params = [];
    params['q'] = fql;
    fbapi.raw("GET","/fql", params ,function(err, data){
        if (err) {
            logger.error(err);
            return
        } else {
            callback(data);
        }
    });
}

/**
 * Facebook likes update
 */

function updateAdvices () {
    var self = this;
    //TODO: There is a potential problem here.
    //We should prevent running the second instance of job if first is still running
    logger.info("Started job for facebook likes update");
    Advice.findReadyForFacebookUpdate(function(err, advices) {
        if (err) {
            logger.error("Error during finding advices that should be update on facebook:" + err);
            return
        } else if (advices){
            advices.forEach(function(advice){
                update(advice, self.fbapi);
            });
        }
    });
};

var FacebookLikesUpdater = function(fbapi) {
    //Facebook API is injected during application startup
    this.fbapi = fbapi;
};

FacebookLikesUpdater.prototype.updateAdvices = updateAdvices;

module.exports = function(fbapi) {
    return new FacebookLikesUpdater(fbapi);
};

