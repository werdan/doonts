var Advice = db.model("Advice");
var logger = app.set("logger");

var amazonHelper = require("./helper/adviceAmazonUpdater.js");
var youtubeHelper = require("./helper/adviceYoutubeUpdater.js");


/**
 * Like/unlike facebook buttons handling
 *
 * match patterns: /advice/like/123123
 *                 /advice/unlike/123123
 *
 */
module.exports = function (app, amazonClient, youtubeClient) {
    app.post(/^\/advice\/(un)?like\/(\d+)/, function (req, res, next) {
        var unlike = req.params[0];
        var adviceUID = req.params[1];

        Advice.findByUID(adviceUID, function (err, advice) {
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
                advice.save(function (err) {
                    if (err) {
                        next(new Error(err));
                        return
                    }
                    res.render('empty.ejs');
                });
            }
        });
    });

    app.get('/advice/media/:mediaType/:adviceUID', function (req, res, next) {

        if (! req.hasOwnProperty('params') ||
            ! req.params.hasOwnProperty('adviceUID') ||
            ! req.params.hasOwnProperty('mediaType')) {
            next(new Error("Expecting two params: mediaType and adviceUID"));
            return;
        }

        Advice.findByUID(req.params.adviceUID, function (err, advice) {
            if (err) {
                next(new Error(err));
                return;
            }
            switch (req.params.mediaType)  {
                case 'amazon' :
                    amazonHelper(amazonClient, advice,res,next);
                    break;
                case 'youtube':
                    youtubeHelper(youtubeClient, advice,res,next);
                    break;
                default:
                    next(new Error("Unrecognized media type"));
            }

        });
    });
};
