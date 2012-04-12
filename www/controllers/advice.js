var Advice = db.model("Advice");
var logger = app.set("logger");

var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     app.set("web.amazon.awsId"),
    awsSecret: app.set("web.amazon.awsSecret"),
    assocId:   app.set("web.amazon.assocId")
});


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

    var awsAssocId = app.set("web.amazon.assocId");

    app.get('/advice/apac/:asin', function(req,res,next){

        var callbackFuncName = 'amazonPreviewCallback';

        opHelper.execute('ItemLookup', {
            'ItemId': req.params.asin,
            'RelationshipType': 'AuthorityTitle',
            'IncludeReviewsSummary' : 'false'
        }, function(error, results) {
            if (error) {
                next(new Error(error));
                return
            }

            var result = {asin: results['Items']['Item']['ASIN'],
                          title: results['Items']['Item']['ItemAttributes']['Title'],
                          url: results['Items']['Item']['DetailPageURL'],
                          author: results['Items']['Item']['ItemAttributes']['Author'],
                          imgSrc: getImgSrc(req.params.asin)
                         };
            res.render('advice/apac.ejs',{resultJson: JSON.stringify(result), callback: callbackFuncName});
        });
    });

    function getImgSrc(asin) {
        return "http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&Format=_SL110_&ID=AsinImage&WS=1&tag=" + awsAssocId + "&ServiceVersion=20070822&ASIN=" + asin;
    }
};
