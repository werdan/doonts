var Advice = db.model("Advice");
var logger = app.set("logger");

/**
 * Like/unlike facebook buttons handling
 * 
 * match patterns: /advice/like/123123 
 *                 /advice/unlike/123123
 * 
 */
module.exports = function(app) {
	app.post(/^\/advice\/(un)?like\/(\d+)/, function(req,res,next){
	    var unlike = req.params[0];
	    var adviceUID = req.params[1];
	    
	    Advice.findByUID(adviceUID, function(err,advice) {
	        if (err) {
	            next(new Error(err));
	            return
	        } else if (!advice) {
	            next(new Error("Advice with uid:" + adviceUID + " not found"));
	            return
	        } else {
	            //Set update time in past - to be updated ASAP
	            logger.info("Advice uid= " + advice.uid + " to be updated with Facebook ASAP");
	            advice.nextFacebookInfoUpdateTime = 0;
	            if (unlike) {
	                --advice.facebookLikes;
	            } else {
	                ++advice.facebookLikes;
	            }
	            advice.save(function(err){
	                if (err) {
	                    next(new Error(err));
	                    return
	                }
	                res.render('empty.ejs');
	            });
	        }
	    });
	});
};
