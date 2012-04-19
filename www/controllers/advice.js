var Advice = db.model("Advice");
var logger = app.set("logger");

/**
 * Like/unlike facebook buttons handling
 * 
 * match patterns: /advice/like/123123 
 *                 /advice/unlike/123123
 * 
 */
module.exports = function(app, amazonClient) {
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

    app.get('/advice/apac/:adviceUID', function(req,res,next){

        var callbackFuncName = 'amazonPreviewCallback';

        if (!req.params || ! req.params.adviceUID) {
            next(new Error("Advice UID not found"));
            return;
        }
         Advice.findByUID(req.params.adviceUID,function(err,advice){
            var asin = advice.amazon.asin;

            amazonClient.execute('ItemLookup', {
                'ItemId': asin,
                'RelationshipType': 'AuthorityTitle',
                'IncludeReviewsSummary' : 'false'
            }, function(error, results) {
                if (error) {
                    next(new Error(error));
                    return
                }
                var result = {};

                if (advice.amazon.title) {
                    result = getResultWithAmazonInfo(advice)
                } else {
                    result = extractAmazonInfo(advice, results);
                }

                res.render('advice/apac.ejs',{resultJson: JSON.stringify(result), callback: callbackFuncName});
            });
        });
    });

    function getImgSrc(asin) {
        var awsAssocId = app.set("web.amazon.assocId");

        return "http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&Format=_SL110_&ID=AsinImage&WS=1&tag=" + awsAssocId + "&ServiceVersion=20070822&ASIN=" + asin;
    }

    function extractAmazonInfo(advice, results) {
        var result = {asin: results['Items']['Item']['ASIN'],
            title: results['Items']['Item']['ItemAttributes']['Title'],
            url: results['Items']['Item']['DetailPageURL'],
            author: results['Items']['Item']['ItemAttributes']['Author'],
            imgSrc: getImgSrc(results['Items']['Item']['ASIN'])
        };

        advice.amazon.title = result.title;
        advice.amazon.url = result.url;
        advice.amazon.author = result.author;
        advice.amazon.imgSrc = result.imgSrc;
        advice.save();
        return result;
    }

    function getResultWithAmazonInfo(advice) {
        var result = {
            title: advice.amazon.title,
            url: advice.amazon.url,
            author: advice.amazon.author,
            imgSrc: advice.amazon.imgSrc
        };
        return result;
    }
};
