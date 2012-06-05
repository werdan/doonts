var Role = db.model("Role");
var User = db.model("User");
var logger = app.set("logger");

module.exports = function(app, securityManager, seoFooterDataAppender) {
	app.get('/role/view/:roleUID/:urlTitle', seoFooterDataAppender, function(req, res, next) {
		Role.findByUID(req.params.roleUID)
		    .populate('advices')
		    .run(function(err, role) {
			if (err) {
				next(new Error(err));
				return;
			} else if (!role) {
                logger.warn("Role id=" + req.params.roleUID + " was not found");
				next();
				return;
			} else {
               fillInAuthors(role, next, function(authors){
                    var focusedAdvice = null;

                    role.advices.sort(sortByTimestampCreated);

                    //TODO: There should be a better way to copy object by value, but I didn't find it
                    var topAdvices = new Array();
                    role.advices.forEach(function(advice) {
                        if (req.hasOwnProperty('query') &&
                            req.query.hasOwnProperty('advice') &&
                            advice.uid == req.query.advice) {

                            focusedAdvice = advice;
                        }
                        topAdvices.push(advice);
                    });
                    topAdvices.sort(sortByFacebookLikes);

                    role.topAdvices = topAdvices;
                    res.render('role/role.ejs',
                        {role: role,
                        rolePage: true,
                        authors: authors,
                        og: getOgMeta(role,focusedAdvice),
                        adviceMaxLength: app.set("web.adviceMaxLength")
                        }
                    );
                });
			}
		});
	});

	app.post('/role/update/:roleUID', securityManager.requireAuth, function(req,res, next){
		Role.findByUID(req.params.roleUID, function(err, role) {
			if (err) {
				next(new Error(err));
				return
			} else if (!role) {
				next(new Error("Role id=" + req.params.roleUID + " was not found"));
				return;
			} else {
				role.name = req.params.name;
				logger.info("Updating with role.name = " + role.name);
				role.save(function(err){
					if (err) {logger.error(err);}
					logger.info("Role id = " + role.uid + " is updated");
					res.redirect('/role/' + role.uid + '/' + role.urlTitle);
				});
			}
		});
	});

    app.post('/role/create', function(req,res,next){
        if (typeof req.body.roleName === 'undefined') {
            logger.warn("Role create action called with empty role name");
            res.redirect('/');
            return;
        } else if (typeof req.body.key === 'undefined' || ! isCorrectSecretKey(req.body.roleName, req.body.key)) {
            logger.warn("SecretKey for role creation is undefined or incorrect");
            res.redirect('/search?q=' + req.body.roleName);
            return;
        } else {
            Role.findOne({name:req.body.roleName}, function(err, role){
                if (err) {
                    next(new Error(err));
                    return;
                } else if (!role) {
                    logger.info("Creating new role with name '" + req.body.roleName + "'");
                    findNextUIDAndCreateRole(req, res, next);
                } else {
                    logger.info("Role with name '" + req.body.roleName + "' already exists - redirecting to role/view page");
                    res.redirect(role.href);
                    return;
                }
            });
        }
    });

    function fillInAuthors(role, next, callback) {
        var authorIds = new Array();
        role.advices.forEach(function(advice){
            authorIds.push(advice.author);
        });
        User.findByIds(authorIds,function(err,authors){
            if (err) {
                next(new Error(err));
                return;
            }
            var authorsWithKeys = [];
            authors.forEach(function(author) {
                authorsWithKeys[author._id] = author;
            });
            callback(authorsWithKeys);
        });

    }

    function isCorrectSecretKey(roleName, key) {
            return Role.getSecretKeyForName(roleName) === key;
    }

    function findNextUIDAndCreateRole(req, res, next){
        Role.find().desc('uid').limit(1).run(function(err,docs){
            if (typeof docs[0] == 'undefined' || !docs[0].hasOwnProperty('uid')) {
                docs[0] = {uid:1};
            }
            logger.debug("Found a biggest uid for role = " + docs[0].uid);
            createRoleAndRedirect(req, res, next, docs[0].uid+1);
        });
    }

    function createRoleAndRedirect(req, res, next, uid) {
        logger.debug("Trying to create role with new uid = " + uid);
        Role.create({name: req.body.roleName, uid: uid}, function(err,role){
            if (err && err.code == 11000) {
                logger.warn("Bumped into a duplicate role UID when creating a role");
                findNextUIDAndCreateRole(req, res, next);
                return;
            } else if (err) {
                next(new Error(err));
                return;
            }
            role.save(function(err){
                if (err) {
                    next(new Error(err));
                    return;
                }
                updateRoleWithAuthor(req,next, role, function(){
                    res.redirect(role.href);
                    return;
                });
            });
        });
    }

    function updateRoleWithAuthor(req, next, role, callback) {
        logger.info("Trying to set author for new role");
        if (securityManager.isLoggedIn(req)) {
            logger.info("User is logged-in, we can link user account to role")
            User.findByUID(req.session.userId,function(err,user){
                if (err) {
                    next(new Error(err));
                    return;
                }
                if (user) {
                    role.author = user;
                    role.save(function(err){
                        if (err) {
                            next(new Error(err));
                            return;
                        }
                        callback(role);
                        return;
                    });
                }
                logger.error("User with id " + req.session.userId + " is not found");
            });
        } else {
            logger.info("User is not logged-in, can not link user account to role");
            callback(role);
            return;
        }
    }

    function sortByFacebookLikes(adviceA, adviceB) {
        return adviceB.facebookLikes - adviceA.facebookLikes;
    }

    function sortByTimestampCreated(adviceA, adviceB) {
        return adviceB.timestampCreated - adviceA.timestampCreated;
    }

    function getOgMeta(role,advice) {
        var og = new Array();
        og['title'] = "Advice for @" + role.name;

        //Setting default for overriding
        og['url'] = role.href;
        og['type'] = 'article';
        og['image'] = app.set('web.unsecureUrl') + app.set('web.facebook.logo');

        if (advice !== null) {
            og['description'] = advice.text;
            og['url'] = role.href + "?advice=" + advice.uid;
            if (typeof advice.youtube.url === 'string' &&
                advice.youtube.url.length > 0) {
                og['type'] = 'video';
                og['video'] = advice.youtube.contentUrl;
                og['video:type'] = 'application/x-shockwave-flash';
                og['image'] = advice.youtube.imgSrc;
                og['image:width'] = '120';
                og['image:height'] = '90';
            }
            if (typeof advice.amazon.url === 'string' &&
                advice.amazon.url.length > 0) {
                og['type'] = 'book';
                og['image'] = advice.amazon.imgSrc;
                og['image:width'] = '64';
                og['image:height'] = '110';
            }
        }
        return og;
    }
};