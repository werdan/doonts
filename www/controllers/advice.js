var Advice = db.model("Advice");
var User = db.model("User");
var Role = db.model("Role");
var logger = app.set("logger");
var url = require('url');

var amazonHelper = require("./helper/adviceAmazonUpdater.js");
var youtubeHelper = require("./helper/adviceYoutubeUpdater.js");

module.exports = function (app, securityManager, amazonClient, youtubeClient) {

    function saveNewAdviceInSession(req, res, next) {
        if (typeof req.session.newAdvice !== 'undefined') {
            logger.warn("Already has not-saved advice in session. Droping this advice creation request");
            next();
            return
        } else if (typeof req.params.roleUID === 'undefined') {
            next(new Error("Can not create an advice without role ID"));
            return;
        } else if (typeof req.body.text === 'undefined') {
            next(new Error("Can not create empty advice"));
            return;
        } else {
            var roleUID = req.params.roleUID;
            var adviceText = req.body.text;
        }

        Role.findByUID(roleUID, function (err, role) {
            if (err) {
                next(new Error(err));
                return
            } else if (!role) {
                next(new Error("Role with uid:" + roleUID + " not found"));
                return
            } else {
                logger.debug("Creating new advice and saving it to user session");
                req.session.newAdvice = {text: adviceText, roleId: role._id};
                req.session.newAdvice = parseMediaLink(req, req.session.newAdvice);
                next();
                return;
            }
        });
    }

    function findNextUIDAndCreateAdvice(req, res, next){
        Advice.find().desc('uid').limit(1).run(function(err,docs){
            if (!docs[0]) {
                logger.debug("Empty advice collection - starting from uid=100");
                docs[0] = {uid:100};
            }
            logger.debug("Found a highest uid for advice = " + docs[0].uid);
            createAdviceAndRedirect(req, res, next, docs[0].uid+1);
        });
    }

    function parseMediaLink(req, newAdviceDescription) {
        if (req.hasOwnProperty('body') &&
            req.body.hasOwnProperty('mediaLink') &&
            req.body.mediaLink.length > 0 &&
            req.body.hasOwnProperty('mediaType')) {

            var mediaLink = req.body.mediaLink;
            switch (req.body.mediaType) {
                case "amazon":
	                logger.debug("Trying to match amazon link in url: " + mediaLink);
                    var matches = mediaLink.match(/\/dp\/([^\/]*)(\/|$)/);
                    if (matches != null) {
                        newAdviceDescription.amazon = matches[1];
			            logger.debug('Amazon ASIN found: ' + matches[1]);
                    }
                    break;
                case "youtube":
		            logger.debug("Trying to match youtube link in url: " + mediaLink);
                    var parsedUrl = url.parse(mediaLink, true);
                    if (parsedUrl.query.hasOwnProperty('v')) {
                        newAdviceDescription.youtube = parsedUrl.query.v;
			            logger.debug('Youtube videoID found: ' + parsedUrl.query.v);
                    }
                    break;
                default:
                    logger.warn("Wrong mediaType ' " + req.body.mediaType + ' "');
            }
        }
        return newAdviceDescription;
    }

    function createAdviceAndRedirect(req, res, next, adviceUID) {
        var newAdviceDescription = {text: req.session.newAdvice.text,
            roleId: req.session.newAdvice.roleId,
            uid: adviceUID};

        if (req.session.newAdvice.hasOwnProperty('youtube')) {
            newAdviceDescription.youtube = {'videoId': req.session.newAdvice.youtube};
        } else if(req.session.newAdvice.hasOwnProperty('amazon')) {
            newAdviceDescription.amazon = {'asin': req.session.newAdvice.amazon};
        }

        Advice.create(newAdviceDescription, function(err,advice){
            if (err && err.code == 11000) {
                logger.warn("Bumped into a duplicate role UID when creating a role");
                findNextUIDAndCreateAdvice(req, res, next);
                return;
            } else if (err) {
                next(new Error(err));
                return;
            } else {
                advice.save(function(err){
                    if (err) {
                        next(new Error(err));
                    }
                    advice.getRole(function(err, role){
                        if (err) {
                            next(new Error(err));
                        }
                        if (!role) {
                            next(new Error(err));
                        }
                        role.advices.push(advice);
                        role.save(function(err){
                            if (err) {
                                next(new Error(err));
                            }
                            updateAdviceWithAuthor(req, next, advice, function(){
                                delete req.session.newAdvice;
                                res.redirect(role.href);
                                return;
                            });
                        });
                    });
                });
            }
        });
    }


    function requireAuth(req, res, next) {
        var args = [];
        args.push(req);
        args.push(res);
        args.push(next);
        securityManager.requireAuth.apply(securityManager, args);
    }


    function updateAdviceWithAuthor(req, next, advice, callback) {
        logger.info("Trying to set author for new advice");
        if (securityManager.isLoggedIn(req)) {
            logger.info("User is logged-in, we can link user account to role")
            User.findByUID(req.session.userId,function(err,user){
                if (err) {
                    next(new Error(err));
                    return;
                }
                if (user) {
                    advice.author = user;
                    advice.save(function(err){
                        if (err) {
                            next(new Error(err));
                            return;
                        }
                        callback();
                        return;
                    });
                }
                logger.error("User with id " + req.session.userId + " is not found");
            });
        } else {
            logger.info("User is not logged-in, can not link user account to new advice");
            callback();
            return;
        }
    }

    /**
     * Like/unlike facebook buttons handling
     *
     * match patterns: /advice/like/123123
     *                 /advice/unlike/123123
     *
     */
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

    app.all('/advice/create/:roleUID', saveNewAdviceInSession, requireAuth,  function (req, res, next) {
        findNextUIDAndCreateAdvice(req, res, next);
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
